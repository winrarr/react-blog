package configs

import (
	"github.com/joho/godotenv"
)

// TODO: make env variables constants instead of loading every time

func EnvMongoURI() string {
	_ = godotenv.Load("../.env")
	return "mongodb+srv://api:fadervor123@survey.gdlc0m1.mongodb.net/?retryWrites=true&w=majority"
}

func EnvSecret(secretName string) []byte {
	if secretName == "REFRESH_TOKEN" {
		return []byte("refreshsecret")
	} else {
		return []byte("accesssecret")
	}
}

func EnvIsProductionMode() bool {
	return true
}
