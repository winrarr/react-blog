package models

type UserLevel string

const (
	User  UserLevel = "1"
	Admin UserLevel = "2"
)

type Credentials struct {
	Username string `binding:"required" json:"username"`
	Password string `binding:"required" json:"password"`
}

type DBUser struct {
	Username   string
	HSPassword []byte
	UserLevel  UserLevel
}

type Auth struct {
	Session   string
	UserLevel UserLevel
}

func NewAuth(session string, userLevel UserLevel) Auth {
	return Auth{
		session,
		userLevel,
	}
}
