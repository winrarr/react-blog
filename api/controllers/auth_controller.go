package controllers

import (
	"api/utils"

	"github.com/gin-gonic/gin"
)

func Refresh(c *gin.Context) {
	utils.PrintBody(c)
}
