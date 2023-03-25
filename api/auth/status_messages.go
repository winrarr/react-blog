package auth

type StatusMessage int

const (
	Success StatusMessage = iota
	InternalError
	UserAlreadyExists
	UserDoesNotExist
	IncorrectPassword
	InvalidToken
	RefreshTokenExpired
)
