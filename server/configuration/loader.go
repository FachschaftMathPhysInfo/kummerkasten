package configuration

import (
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/FachschaftMathPhysInfo/kummerkasten/utils"
	"github.com/knadh/koanf/parsers/json"
	"github.com/knadh/koanf/providers/env/v2"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

var (
	SystemConfiguration Configuration
	k                   = koanf.New(".")
)

func LoadSystemConfiguration() {
	loadConfigurationFromJson()
	loadConfigurationFromEnv()
	loadAdminPassword()
	loadMissingConfigurationValues()

	loadIntoGlobalStruct()
	validateConfiguration()

	log.Printf("Database config: %v", SystemConfiguration.Database)
}

func loadConfigurationFromJson() {
	if err := k.Load(file.Provider("../config.json"), json.Parser()); err != nil {
		log.Printf("error loading config from config.json: %v", err)
	}
}

func loadConfigurationFromEnv() {
	envPrefix := "KUMMERKASTEN_"

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

func loadAdminPassword() {
	if k.Get("admin.password") == "" {
		if k.Get("system.mode") == "DEV" {
			if err := k.Set("admin.password", "admin"); err != nil {
				log.Fatalf("error setting admin password, aborting")
			}
		} else {
			password, _ := utils.RandString(32)
			if err := k.Set("admin.password", password); err != nil {
				log.Fatalf("error setting admin password, aborting")
			}
		}
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

	if k.String("admin.mail") == "" {
		err = k.Set("admin.mail", "admin@kummerkasten")
	}

	if err != nil {
		log.Printf("error loading missing configuration values: %v", err)
	}
}

func loadIntoGlobalStruct() {
	if err := k.Unmarshal("", &SystemConfiguration); err != nil {
		log.Print("Error loading SystemConfiguration, previous SystemConfiguration will be applied of possible")
	}
}

func validateConfiguration() {
	var configErrors []error

	if SystemConfiguration.Database.Password == "" {
		configErrors = append(configErrors, fmt.Errorf("database.password is empty, please set a password"))
	}

	if SystemConfiguration.System.Domain == "" {
		configErrors = append(configErrors, fmt.Errorf("system.domain is required"))
	}

	if !(SystemConfiguration.System.Mode == "DEV" || SystemConfiguration.System.Mode == "PROD") {
		configErrors = append(configErrors, errors.New("system.mode has to be either 'DEV' or 'PROD'"))
	}

	if len(configErrors) > 0 {
		log.Println("the configration has several errors:")
		for index, err := range configErrors {
			log.Println("[", index+1, "] ", err)
		}

		log.Fatalf("Software booting aborted due to configuration errors")
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
		Name     string `koanf:"name"`
	} `koanf:"database"`
	System struct {
		Domain string `koanf:"domain"`
		Mode   string `koanf:"mode"`
		Pepper string `koanf:"pepper"`
	} `koanf:"system"`
}
