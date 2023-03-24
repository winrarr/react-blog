package configs

import "github.com/gin-gonic/gin"

func GinEngine() *gin.Engine {
	r := ginMode()
	r.Use(Cors())
	return r
}

func ginMode() *gin.Engine {
	if EnvIsProductionMode() {
		gin.SetMode("release")
		return gin.New()
	} else {
		return gin.Default()
	}
}
