package utils

import (
	"bytes"
	"crypto/rand"
	"io/ioutil"
	"log"

	"github.com/gin-gonic/gin"
)

func PrintBody(c *gin.Context) {
	body, _ := ioutil.ReadAll(c.Request.Body)
	println(string(body))
	c.Request.Body = ioutil.NopCloser(bytes.NewReader(body))
}

func RandomBytes(n int) []byte {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		log.Fatal("error generating random string")
	}

	return b
}
