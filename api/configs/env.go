package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// TODO: make env variables constants instead of loading every time

func EnvMongoURI() string {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("MONGOURI")
}

func EnvSecret(secretName string) []byte {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return []byte(os.Getenv(secretName + "_SECRET"))
}

func EnvIsProductionMode() bool {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("MODE") == "production"
}
