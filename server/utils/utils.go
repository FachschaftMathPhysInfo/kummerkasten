package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
)

func RandString(entropy int) (string, error) {
	b := make([]byte, entropy)
	_, err := rand.Read(b)
	if err != nil {
		return "", fmt.Errorf("error generating random string %w", err)
	}
	return base64.RawStdEncoding.EncodeToString(b), nil
}
