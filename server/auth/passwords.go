package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"fmt"
	"log"

	"github.com/FachschaftMathPhysInfo/kummerkasten/configuration"
	"golang.org/x/crypto/bcrypt"
)

var config = configuration.Get()

func HashPassword(password string) (string, error) {
	toHash := []byte(password + config.System.Pepper)
	secretHmac := hmac.New(sha256.New, toHash)
	secretHmac.Write(toHash)
	hash, err := bcrypt.GenerateFromPassword(toHash, bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed hashing password")
		return "", err
	}

	return string(hash), nil
}

func VerifyPassword(storedHash, providedPassword string) error {
	toHash := []byte(providedPassword + config.System.Pepper)
	secretHmac := hmac.New(sha256.New, toHash)
	secretHmac.Write(toHash)

	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), toHash); err != nil {
		return fmt.Errorf("invalid password: %s", err)
	}
	return nil
}
