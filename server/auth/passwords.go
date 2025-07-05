package auth

import (
	"crypto/rand"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"os"
)

func HashPassword(password string) (string, string, error) {
	salt := string(generateSalt())
	toHash := salt + password + os.Getenv("PEPPER")
	hash, err := bcrypt.GenerateFromPassword([]byte(toHash), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed hashing password")
		return "", "", err
	}

	return string(hash), salt, nil
}

func VerifyPassword(storedHash, providedPassword string, salt string) error {
	spicedPassword := salt + providedPassword + os.Getenv("PEPPER")
	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(spicedPassword)); err != nil {
		return fmt.Errorf("invalid password: %s", err)
	}
	return nil
}

func generateSalt() []byte {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		log.Fatalf("Failed generating salt: %v", err)
		return nil
	}
	return b
}
