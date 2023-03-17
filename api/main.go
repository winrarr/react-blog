package main

import (
	"api/configs"
	"api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	configs.ConnectDB()

	routes.UserRoute(router)
	router.Use()

	router.Run("localhost:8080")
}
