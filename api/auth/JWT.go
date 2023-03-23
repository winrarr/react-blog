package auth

import (
	"api/configs"
	"api/models"
	"errors"
	"log"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
)

// claims

type AccessTokenClaims struct {
	UserLevel      models.UserLevel
	StandardClaims jwt.StandardClaims
}

func (c AccessTokenClaims) Valid() error {
	return c.StandardClaims.Valid()
}

// tokens

const (
	RefreshTokenExpiresIn time.Duration = time.Hour * 24
	AccessTokenExpiresIn  time.Duration = time.Minute * 2
)

func newTokens(username string, userLevel models.UserLevel) (string, AccessToken) {
	refreshToken := newRefreshToken(username)
	accessToken := newAccessToken(username, userLevel)
	return refreshToken, accessToken
}

func newRefreshToken(username string) string {
	currentTime := time.Now()
	claims := jwt.StandardClaims{
		ExpiresAt: currentTime.Add(RefreshTokenExpiresIn).Unix(),
		IssuedAt:  currentTime.Unix(),
		Issuer:    "api",
		Subject:   username,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(configs.EnvSecret("REFRESH_TOKEN"))
	if err != nil {
		log.Fatal("unable to create refresh token: ", err)
	}
	return tokenString
}

type AccessToken struct {
	Token     string
	ExpiresAt time.Time
}

func newAccessToken(username string, userLevel models.UserLevel) AccessToken {
	currentTime := time.Now()
	expiresAt := currentTime.Add(AccessTokenExpiresIn)
	claims := AccessTokenClaims{
		UserLevel: userLevel,

		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiresAt.Unix(),
			IssuedAt:  currentTime.Unix(),
			Issuer:    "api",
			Subject:   username,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(configs.EnvSecret("ACCESS_TOKEN"))
	if err != nil {
		log.Fatal("unable to create access token token: ", err)
	}
	return AccessToken{
		Token:     tokenString,
		ExpiresAt: expiresAt,
	}
}

func ParseAccessToken(authHeader string) (*AccessTokenClaims, error) {
	tokenString, found := strings.CutPrefix(authHeader, "Bearer ")
	if !found {
		return nil, errors.New("access token auth header should start with \"Bearer \"")
	}

	token, err := jwt.ParseWithClaims(tokenString, &AccessTokenClaims{}, keyFunc("ACCESS_TOKEN"))
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*AccessTokenClaims)
	if !ok {
		return nil, errors.New("incorrect format for claims")
	}

	return claims, nil
}

func keyFunc(secretName string) jwt.Keyfunc {
	return func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected jwt signing method")
		}

		return configs.EnvSecret(secretName), nil
	}
}
