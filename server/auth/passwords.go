package auth

import (
	"crypto/sha256"
	"fmt"
	"log"

	"github.com/FachschaftMathPhysInfo/kummerkasten/utils"
	"golang.org/x/crypto/bcrypt"
)

var envConf = utils.EnvConfig

func HashPassword(password string) (string, error) {
	spicedPassword := password + envConf.Pepper
	hasher := sha256.New()
	hasher.Write([]byte(spicedPassword))
	digest := hasher.Sum(nil)

	hash, err := bcrypt.GenerateFromPassword(digest, bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed hashing password: %v", err)
		return "", err
	}

	return string(hash), nil
}

func VerifyPassword(storedHash string, providedPassword string) error {
	spicedPassword := providedPassword + envConf.Pepper
	hasher := sha256.New()
	hasher.Write([]byte(spicedPassword))
	digest := hasher.Sum(nil)

	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), digest); err != nil {
		return fmt.Errorf("invalid password: %v", err)
	}

	return nil
}
