package models

type AuthResponse struct {
	AccessToken string
	UserLevel   UserLevel
}

type RefreshTokenResponse struct {
	Username     string
	RefreshToken RefreshToken
}

type RefreshToken string
type AccessToken string
