package configuration

import (
	"errors"
	"fmt"
	"log/slog"
	"os"
)

var (
	validSystemModes = map[string]bool{
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
