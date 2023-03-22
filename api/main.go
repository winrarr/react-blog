package main

import (
	"api/middleware"
	"api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.Use(cors.Default())
	router.Use(middleware.VerifyAccessToken)

	routes.AuthRoutes(router)
	routes.UserRoutes(router)

	router.Run("localhost:8080")
}
