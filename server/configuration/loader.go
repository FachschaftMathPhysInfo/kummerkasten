package configuration

import (
	"errors"
	"fmt"
	"log/slog"
	"os"
	"strings"

	"github.com/FachschaftMathPhysInfo/kummerkasten/utils"
	"github.com/knadh/koanf/parsers/json"
	"github.com/knadh/koanf/providers/env/v2"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

var (
	systemConfiguration Configuration
	k                   = koanf.New(".")
	validSystemModes    = map[string]bool{
		"DEV":  true,
		"PROD": true,
	}
	validSystemLogLevels = map[string]bool{
		"INFO":  true,
		"WARN":  true,
		"ERROR": true,
	}
	validLanguages = map[string]bool{
		"en": true,
		"de": true,
	}
)

func Get() Configuration {
	return systemConfiguration
}

func Init() {
	loadConfigurationFromJson()
	loadConfigurationFromEnv()
	loadMissingConfigurationValues()

	loadIntoGlobalStruct()
	validateConfiguration()

	applyLogLevel()
}

func loadConfigurationFromJson() {
	localConfigPath := "../config.json"
	containerConfigPath := "/app/config.json"
	foundAnyConfigFile := false

	if _, err := os.Stat(localConfigPath); err == nil {
		if err := k.Load(file.Provider(localConfigPath), json.Parser()); err != nil {
			slog.Error("Cannot open local config", "path", localConfigPath, "error", err)
		}
		foundAnyConfigFile = true
	}

	if _, err := os.Stat(containerConfigPath); err == nil {
		if err := k.Load(file.Provider(containerConfigPath), json.Parser()); err != nil {
			slog.Error("Cannot open config in container", "path", containerConfigPath, "error", err)
		}
		foundAnyConfigFile = true
	}

	if !foundAnyConfigFile {
		slog.Warn("configuration file not found, trying to use default configuration and ENV variables")
	}
}

func loadConfigurationFromEnv() {
	kastenPrefix := "KUMMERKASTEN_"
	databasePrefix := "POSTGRES_"

	if err := k.Load(env.Provider(".", env.Opt{
		Prefix: kastenPrefix,
		TransformFunc: func(key, value string) (string, any) {
			key = strings.ReplaceAll(strings.ToLower(strings.TrimPrefix(key, kastenPrefix)), "_", ".")
			return key, value
		},
	}), nil); err != nil {
		slog.Error("error loading environment variables", "error", err)
	}

	if err := k.Load(env.Provider(".", env.Opt{
		Prefix: databasePrefix,
		TransformFunc: func(key, value string) (string, any) {
			key = strings.ReplaceAll(strings.ToLower(strings.Replace(key, "POSTGRES_", "DATABASE_", 1)), "_", ".")
			return key, value
		},
	}), nil); err != nil {
		slog.Error("error loading environment variables", "error", err)
	}
}

func loadMissingConfigurationValues() {
	var err error

	if k.String("database.host") == "" {
		err = k.Set("database.host", "localhost")
	}

	if k.String("database.port") == "" {
		err = k.Set("database.port", "5432")
	}

	if k.String("database.user") == "" {
		err = k.Set("database.user", "kummerkasten_user")
	}

	if k.String("database.name") == "" {
		err = k.Set("database.name", "kummerkasten")
	}

	if !validSystemLogLevels[k.String("system.loglevel")] {
		err = k.Set("system.loglevel", "INFO")
	}

	if k.String("admin.mail") == "" {
		err = k.Set("admin.mail", "admin@kummer.kasten")
	}

	if k.String("admin.password") == "" {
		loadAdminPassword()
	}

	if k.String("system.frontend.default_language") == "" {
		err = k.Set("system.frontend.default_language", "de")
	}

	if err != nil {
		slog.Error("error loading missing configuration values", "error", err)
	}
}

func loadAdminPassword() {
	if k.Get("system.mode") == "DEV" {
		if err := k.Set("admin.password", "admin"); err != nil {
			slog.Error("error setting admin password, aborting")
			os.Exit(1)
		}
	} else {
		password, _ := utils.RandString(32)
		if err := k.Set("admin.password", password); err != nil {
			slog.Error("error setting admin password, aborting")
			os.Exit(1)
		}
	}

}

func loadIntoGlobalStruct() {
	if err := k.Unmarshal("", &systemConfiguration); err != nil {
		slog.Warn("Error loading SystemConfiguration, previous SystemConfiguration will be applied if possible")
	}
}

func validateConfiguration() {
	var configErrors []error

	if systemConfiguration.Database.Password == "" {
		configErrors = append(configErrors, fmt.Errorf("database.password is empty, please set a password"))
	}

	if systemConfiguration.System.Domain == "" {
		configErrors = append(configErrors, fmt.Errorf("system.domain is required"))
	}

	if !validSystemModes[systemConfiguration.System.Mode] {
		configErrors = append(configErrors, errors.New("system.mode has to be either 'DEV' or 'PROD'"))
	}

	if systemConfiguration.System.LogLevel != "" && !validSystemLogLevels[systemConfiguration.System.LogLevel] {
		configErrors = append(configErrors, errors.New("system.loglevel has to be either unset, 'INFO', 'WARN' or 'ERROR"))
	}

	if systemConfiguration.Admin.Password == "" {
		configErrors = append(configErrors, fmt.Errorf("admin.password is empty, please set a password"))
	}

	if !validLanguages[systemConfiguration.System.Frontend.DefaultLanguage] {
		configErrors = append(configErrors, fmt.Errorf("system.frontend.default_language has to be either 'en', or 'de'"))
	}

	if len(configErrors) > 0 {
		slog.Error("the configration has several errors:")
		for _, err := range configErrors {
			slog.Error(err.Error())
		}

		slog.Error("Software booting aborted due to configuration errors")
		os.Exit(1)
	}
}

func applyLogLevel() {
	switch systemConfiguration.System.LogLevel {
	case "INFO":
		utils.LogLevel.Set(slog.LevelInfo)
	case "WARN":
		utils.LogLevel.Set(slog.LevelWarn)
	case "ERROR":
		utils.LogLevel.Set(slog.LevelError)
	}
}

type Configuration struct {
	Admin struct {
		Mail     string `koanf:"mail"`
		Password string `koanf:"password"`
	} `koanf:"admin"`
	Database struct {
		Host     string `koanf:"host"`
		Port     string `koanf:"port"`
		User     string `koanf:"user"`
		Password string `koanf:"password"`
		Name     string `koanf:"db"`
	} `koanf:"database"`
	System struct {
		Domain   string `koanf:"domain"`
		Mode     string `koanf:"mode"`
		Pepper   string `koanf:"pepper"`
		LogLevel string `koanf:"loglevel"`
		Frontend struct {
			DefaultLanguage string `koanf:"default_language"`
		}
	} `koanf:"system"`
}
