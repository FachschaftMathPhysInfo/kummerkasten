package configuration

import (
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/knadh/koanf/parsers/json"
	"github.com/knadh/koanf/providers/confmap"
	"github.com/knadh/koanf/providers/env/v2"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

var configuration Configuration

type Configuration struct {
	Admin struct {
		Mail     string `koanf:"mail"`
		Password string `koanf:"password"`
	} `koanf:"admin"`
	Database struct {
		Host     string `koanf:"host"`
		Port     string `koanf:"port"`
		User     string `koanf:"username"`
		Password string `koanf:"password"`
		Name     string `koanf:"name"`
	} `koanf:"database"`
	System struct {
		Domain string `koanf:"domain"`
		Mode   string `koanf:"mode"`
		Pepper string `koanf:"pepper"`
	} `koanf:"system"`
}

var (
	envPrefix = "KASTEN_"
	k         = koanf.New(".")
)

func GetConfiguration() Configuration {
	loadDefaultConfigurationValues()
	loadConfigurationFromJson()
	loadConfigurationFromEnv()
	validateConfiguration()

	if err := k.Unmarshal("/", &configuration); err != nil {
		log.Print("Error loading configuration, previous configuration will be applied of possible")
	}

	return configuration
}

func loadDefaultConfigurationValues() {
	if err := k.Load(confmap.Provider(map[string]interface{}{
		"database.host": "postgres",
		"database.port": "5432",
		"database.name": "kummerkasten",
		"admin.mail":    "admin@kummer.kasten",
		"system.pepper": "",
	}, "."), nil); err != nil {
		log.Printf("Error loading default configuration: %v", err)
	}
}

func loadConfigurationFromJson() {
	if err := k.Load(file.Provider("../../config.json"), json.Parser()); err != nil {
		log.Printf("error loading config from config.json: %v", err)
	}
}

func loadConfigurationFromEnv() {
	if err := k.Load(env.Provider(".", env.Opt{
		Prefix: envPrefix,
		TransformFunc: func(key, value string) (string, any) {
			key = strings.ReplaceAll(strings.ToLower(strings.TrimPrefix(key, envPrefix)), "_", ".")
			return key, value
		},
	}), nil); err != nil {
		log.Printf("error loading environment variables: %v", err)
	}
}

func validateConfiguration() {
	var configErrors []error

	if configuration.Database.Password == "" {
		configErrors = append(configErrors, fmt.Errorf("database password is empty, please set a password"))
	}

	if configuration.System.Domain == "" {
		configErrors = append(configErrors, fmt.Errorf("system.domain is required"))
	}

	if !(configuration.System.Mode == "DEV" || configuration.System.Mode == "PROD") {
		configErrors = append(configErrors, errors.New("system.mode has to be either 'DEV' or 'PROD'"))
	}

	if len(configErrors) > 0 {
		log.Println("the configration has several errors:")
		for _, err := range configErrors {
			log.Println(err)
		}

		log.Fatalf("Software booting aborted due to configuration errors")
	}
}
