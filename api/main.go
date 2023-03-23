package main

import (
	"api/configs"
	"api/routes"
)

func main() {
	r := configs.GinEngine()

	r.Use(configs.Cors())

	routes.AuthRoutes(r)
	routes.UserRoutes(r)

	r.Run("localhost:8080")
}
