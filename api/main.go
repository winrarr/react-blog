package main

import (
	"api/configs"
	"api/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := configs.GinEngine()
	addRoutes(r)
	r.Run("localhost:8080")
}

func addRoutes(r *gin.Engine) {
	routes.AuthRoutes(r)
	routes.UserRoutes(r)
	routes.BlogRoutes(r)
}
