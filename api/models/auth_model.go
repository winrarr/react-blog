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

type Auth struct {
	RefreshToken string
	AccessToken  string
	UserLevel    UserLevel
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
type UserInfo struct {
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	UserLevel UserLevel `json:"userLevel"`
}
