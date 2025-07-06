package auth

import (
	"crypto/rand"
	"log"
)

func GenerateSID() (string, error) {
	b := make([]byte, 12)
	if _, err := rand.Read(b); err != nil {
		log.Printf("Failed to generate sid: %v", err)
		return "", err
	}
	return string(b), nil
}
