package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// TODO: make env variables constants instead of loading every time

func EnvMongoURI() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("MONGOURI")
}

func EnvGinMode() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("MONGOURI")
}

func EnvRefreshTroken() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("REFRESH_TOKEN_SECRET")
}

func EnvAccessTroken() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("ACCESS_TOKEN_SECRET")
}
