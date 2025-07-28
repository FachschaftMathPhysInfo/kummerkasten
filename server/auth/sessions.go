package auth

import (
	"crypto/rand"
	"encoding/base64"
)

func GenerateSID() (string, error) {
	b := make([]byte, 9)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}

	id := base64.StdEncoding.EncodeToString(b)
	return id[:12], nil
}
