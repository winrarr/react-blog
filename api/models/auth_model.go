package models

// internal
type RefreshTokenExp struct {
	Token     string
	ExpiresAt int64
}

type AccessTokenExp struct {
	Token     string
	ExpiresAt int64
}

type Auth struct {
	RefreshToken string
	AccessToken  string
	UserLevel    UserLevel
}

// response
type AuthResponse struct {
	AccessToken string    `json:"accessToken"`
	UserLevel   UserLevel `json:"userLevel"`
}
