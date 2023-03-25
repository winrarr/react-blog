package models

type RefreshTokenExp struct {
	Token     string
	ExpiresAt int64
}

type AccessTokenExp struct {
	Token     string
	ExpiresAt int64
}

type AuthResponse struct {
	AccessToken string    `json:"accessToken"`
	UserLevel   UserLevel `json:"userLevel"`
}
