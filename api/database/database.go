package database

import (
	"api/configs"
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Client instance
var DB *mongo.Client = ConnectDB()
var UserCollection *mongo.Collection = GetCollection(DB, "users")
var BlogCollection *mongo.Collection = GetCollection(DB, "blogs")

func ConnectDB() *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI(configs.EnvMongoURI()))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	//ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	return client
}

// getting database collections
func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	return client.Database("golangAPI").Collection(collectionName)
}
