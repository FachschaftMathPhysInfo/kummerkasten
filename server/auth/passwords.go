package auth

import (
	"crypto/sha256"
	"fmt"
	"log/slog"

	"golang.org/x/crypto/bcrypt"

	"github.com/FachschaftMathPhysInfo/kummerkasten/configuration"
)

var config = configuration.Get()

func HashPassword(password string) (string, error) {
	spicedPassword := password + config.System.Pepper
	hasher := sha256.New()
	hasher.Write([]byte(spicedPassword))
	digest := hasher.Sum(nil)

	hash, err := bcrypt.GenerateFromPassword(digest, bcrypt.DefaultCost)
	if err != nil {
		slog.Warn("Failed hashing password", "error", err)
		return "", err
	}

	return string(hash), nil
}

func VerifyPassword(storedHash string, providedPassword string) error {
	spicedPassword := providedPassword + config.System.Pepper
	hasher := sha256.New()
	hasher.Write([]byte(spicedPassword))
	digest := hasher.Sum(nil)

	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), digest); err != nil {
		return fmt.Errorf("invalid password: %v", err)
	}

	return nil
}
