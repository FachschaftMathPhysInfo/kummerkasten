package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"os"
)

func HashPassword(password string) (string, error) {
	toHash := []byte(password + os.Getenv("PEPPER"))
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
	toHash := []byte(providedPassword + os.Getenv("PEPPER"))
	secretHmac := hmac.New(sha256.New, toHash)
	secretHmac.Write(toHash)

	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), toHash); err != nil {
		return fmt.Errorf("invalid password: %s", err)
	}
	return nil
}
