package utils

import (
	"bytes"
	"io/ioutil"

	"github.com/gin-gonic/gin"
)

func PrintBody(c *gin.Context) {
	body, _ := ioutil.ReadAll(c.Request.Body)
	println(string(body))
	c.Request.Body = ioutil.NopCloser(bytes.NewReader(body))
}
