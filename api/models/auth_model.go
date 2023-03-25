package models

// internal
type UserLevel int

const (
	Guest UserLevel = iota
	User
	Admin
)

type DBUser struct {
	Username        string
	HSPassword      []byte
	UserLevel       UserLevel
	RefreshTokenExp RefreshTokenExp
}

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

// request
type Credentials struct {
	Username string `binding:"required" json:"username"`
	Password string `binding:"required" json:"password"`
}

// response
type AuthResponse struct {
	AccessToken string `json:"accessToken"`
}
