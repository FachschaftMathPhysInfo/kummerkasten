package configuration

import (
	"log/slog"
	"os"
	"strings"

	"github.com/FachschaftMathPhysInfo/kummerkasten/utils"
	"github.com/knadh/koanf/parsers/json"
	"github.com/knadh/koanf/providers/env/v2"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

var k = koanf.New(".")

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

	if k.Int("system.frontend.max_inputs.public.title") == 0 {
		err = k.Set("system.frontend.max_inputs.public.title", 100)
	}

	if k.Int("system.frontend.max_inputs.public.content") == 0 {
		err = k.Set("system.frontend.max_inputs.public.content", 2000)
	}

	if k.Int("system.frontend.max_inputs.private.titles") == 0 {
		err = k.Set("system.frontend.max_inputs.private.titles", 100)
	}

	if k.Int("system.frontend.max_inputs.private.labels") == 0 {
		err = k.Set("system.frontend.max_inputs.private.labels", 100)
	}

	if k.Int("system.frontend.max_inputs.private.names") == 0 {
		err = k.Set("system.frontend.max_inputs.private.names", 50)
	}

	if k.Int("system.frontend.max_inputs.private.faqs.questions") == 0 {
		err = k.Set("system.frontend.max_inputs.private.faqs.questions", 100)
	}

	if k.Int("system.frontend.max_inputs.private.faqs.answers") == 0 {
		err = k.Set("system.frontend.max_inputs.private.faqs.answers", 500)
	}

	if k.Int("system.frontend.max_inputs.private.about") == 0 {
		err = k.Set("system.frontend.max_inputs.private.about", 2000)
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
