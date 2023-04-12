package controllers

import (
	"api/auth"
	"api/configs"
	"api/database"
	"api/models"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"
)

func init() {
	// createAdminUser("a", "a")
}

func createAdminUser(username string, password string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	database.UserCollection.Drop(ctx)
	bytes, _ := bcrypt.GenerateFromPassword([]byte("a"), bcrypt.DefaultCost)
	refreshTokenExp := models.TokenExp{
		Token:     "",
		ExpiresAt: 0,
	}
	user := models.User{
		Username:        "a",
		HSPassword:      bytes,
		UserLevel:       models.Admin,
		RefreshTokenExp: refreshTokenExp,
	}
	database.UserCollection.InsertOne(ctx, user)
}

// POST /signup
func Signup(c *gin.Context) {
	// bind request to model
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	authInfo, status := auth.Signup(credentials.Username, credentials.Password)
	httpStatus, ok := auth.CreateStatusToHttpStatus(status)

	if ok {
		sendAuth(authInfo.Response, authInfo.RefreshToken, authInfo.AccessToken, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

// POST /login
func Login(c *gin.Context) {
	// bind request to model
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	authInfo, status := auth.Login(credentials.Username, credentials.Password)
	httpStatus, ok := auth.CheckStatusToHttpStatus(status)

	if ok {
		sendAuth(authInfo.Response, authInfo.RefreshToken, authInfo.AccessToken, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

func sendAuth(response models.AuthResponse, refreshTokenExp models.TokenExp, accessTokenExp models.TokenExp, httpStatus int, c *gin.Context) {
	c.SetCookie("refreshToken", refreshTokenExp.Token, int(refreshTokenExp.ExpiresAt-time.Now().Unix()), "/", "localhost", true, true)
	c.SetCookie("accessToken", accessTokenExp.Token, int(accessTokenExp.ExpiresAt)-int(time.Now().Unix()), "/", "localhost", true, true)

	println("sending: refreshToken:", refreshTokenExp.Token, int(refreshTokenExp.ExpiresAt-time.Now().Unix()))
	println("sending: accessToken:", accessTokenExp.Token, int(accessTokenExp.ExpiresAt-time.Now().Unix()))

	c.JSON(httpStatus, response)
}

// GET /logout
func Logout(c *gin.Context) {
	tokenString, err := c.Cookie("accessToken")
	println(len(c.Request.Cookies()))
	if err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	status := auth.Logout(tokenString)
	httpStatus, ok := auth.LogoutStatusToHttpStatus(status)

	if ok {
		c.SetCookie("refreshToken", "", -1, "/", "localhost", true, true)
		c.SetCookie("accessToken", "", -1, "/", "localhost", true, true)
		c.Status(http.StatusOK)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

// GET /refresh
func Refresh(c *gin.Context) {
	println(len(c.Request.Cookies()))
	for _, cookie := range c.Request.Cookies() {
		println("received:", cookie.Name+":", cookie.Value)
	}
	tokenString, err := c.Cookie("refreshToken")
	if err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	authInfo, status := auth.Refresh(tokenString)
	httpStatus, ok := auth.RefreshStatusToHttpStatus(status)

	if ok {
		sendAuth(authInfo.Response, authInfo.RefreshToken, authInfo.AccessToken, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

// GET /oauth2
func Oauth2(c *gin.Context) {
	token := c.Query("token")

	if token == "" {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	payload, err := idtoken.Validate(context.Background(), token, configs.EnvGoogleOauth2ClientID())
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	name, ok := payload.Claims["given_name"].(string)
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	refreshTokenExp, accessTokenExp := auth.NewTokens(
		name,
		models.Standard,
	)

	response := models.AuthResponse{
		Username:  name,
		UserLevel: models.Standard,
	}

	sendAuth(response, refreshTokenExp, accessTokenExp, http.StatusOK, c)
}
