package models

// internal
type UserLevel int

const (
	Guest UserLevel = iota
	Standard
	Admin
)

type TokenExp struct {
	Token     string
	ExpiresAt int64
}

type AuthInfo struct {
	RefreshToken TokenExp
	AccessToken  TokenExp
	Response     AuthResponse
}

// database
type User struct {
	Username        string `bson:"_id,omitempty"`
	HSPassword      []byte
	UserLevel       UserLevel
	RefreshTokenExp TokenExp
}

// request
type Credentials struct {
	Username string `binding:"required" json:"username"`
	Password string `binding:"required" json:"password"`
}

// response

type AuthResponse struct {
	Username  string    `json:"username"`
	UserLevel UserLevel `json:"userLevel"`
}
