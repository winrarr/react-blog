package main

import (
	"api/configs"
	"api/routes"

	"github.com/gin-contrib/cors"
)

func main() {
	r := configs.GinEngine()

	r.Use(cors.New(configs.Cors()))

	routes.AuthRoutes(r)
	routes.UserRoutes(r)

	r.Run("localhost:8080")
}
