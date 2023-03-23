package configs

import "github.com/gin-contrib/cors"

func allowAll(origin string) bool {
	return true
}

func Cors() cors.Config {
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOriginFunc = allowAll
	corsConfig.AllowCredentials = true
	return corsConfig
}
