package configs

import "github.com/gin-gonic/gin"

func GinEngine() *gin.Engine {
	if EnvIsReleaseMode() {
		gin.SetMode("release")
		return gin.New()
	} else {
		return gin.Default()
	}
}
