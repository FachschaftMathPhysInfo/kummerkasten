package utils

import (
	"log/slog"
	"os"
)

var logger *slog.Logger

func InitLogger() {
	logger = slog.New(slog.NewTextHandler(os.Stdout, nil))
	slog.SetDefault(logger)
}
