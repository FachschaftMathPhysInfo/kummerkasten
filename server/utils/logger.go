package utils

import (
	"log/slog"
	"os"
)

var LogLevel = &slog.LevelVar{}

func InitLogger() {
	handlerOptions := &slog.HandlerOptions{
		Level: LogLevel,
	}

	logger := slog.New(slog.NewTextHandler(os.Stdout, handlerOptions))
	slog.SetDefault(logger)
}
