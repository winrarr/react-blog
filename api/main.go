package main

import (
	"api/configs"
	"api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.Use(cors.New(configs.Cors()))

	routes.AuthRoutes(router)
	routes.UserRoutes(router)

	router.Run("localhost:8080")
}
