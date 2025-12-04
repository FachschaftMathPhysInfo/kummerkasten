package utils

import (
	"log"
	"os"
)

const (
	EnvPostgresUser     = "POSTGRES_USER"
	EnvPostgresPassword = "POSTGRES_PASSWORD"
	EnvPostgresDB       = "POSTGRES_DB"
	EnvPostgresPort     = "POSTGRES_PORT"
	EnvPostgresHost     = "POSTGRES_HOST"
	EnvAdminMail        = "ADMIN_MAIL"
	EnvAdminPassword    = "ADMIN_PASSWORD"
	EnvPepper           = "PEPPER"
	EnvPublicDomain     = "PUBLIC_DOMAIN"
	EnvEnv              = "ENV"
)

type Config struct {
	PostgresUser     string
	PostgresPassword string
	PostgresDB       string
	PostgresPort     string
	PostgresHost     string
	AdminMail        string
	AdminPassword    string
	Pepper           string
	PublicDomain     string
	Env              string
}

func loadEnvConfig() *Config {
	cfg := &Config{
		PostgresUser:     mustGet(EnvPostgresUser),
		PostgresPassword: mustGet(EnvPostgresPassword),
		PostgresDB:       mustGet(EnvPostgresDB),
		PostgresPort:     mustGet(EnvPostgresPort),
		PostgresHost:     mustGet(EnvPostgresHost),
		AdminMail:        os.Getenv(EnvAdminMail),
		AdminPassword:    os.Getenv(EnvAdminPassword),
		Pepper:           os.Getenv(EnvPepper),
		PublicDomain:     mustGet(EnvPublicDomain),
		Env:              mustGet(EnvEnv),
	}

	return cfg
}

func mustGet(key string) string {
	value := os.Getenv(key)

	if value == "" {
		log.Fatalf("entry missing but required for environment variable: %s", key)
	}

	return value
}

var EnvConfig = loadEnvConfig()
