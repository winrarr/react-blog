package models

type UserLevel int

const (
	Default UserLevel = iota
	Moderator
)

type Credentials struct {
	Username string `binding:"required" form:"username"`
	Password string `binding:"required" form:"password"`
}

type DBUser struct {
	Username   string
	HSPassword []byte
	UserLevel  UserLevel
}
