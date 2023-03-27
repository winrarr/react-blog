package configs

import (
	"os"

	"github.com/joho/godotenv"
)

// TODO: make env variables constants instead of loading every time

func EnvMongoURI() string {
	_ = godotenv.Load("../.env")
	return os.Getenv("MONGOURI")
}

func EnvSecret(secretName string) []byte {
	_ = godotenv.Load("../.env")
	return []byte(os.Getenv(secretName + "_SECRET"))
}

func EnvIsProductionMode() bool {
	_ = godotenv.Load("../.env")
	return os.Getenv("MODE") == "production"
}
