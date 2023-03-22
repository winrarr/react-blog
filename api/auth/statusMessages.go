package auth

// base
const (
	Success = iota
	InternalError
	base
)

// sign up
type CreateStatus int

const (
	UserAlreadyExists CreateStatus = iota + base
)

// log in
type CheckStatus int

const (
	UserDoesNotExist CheckStatus = iota + base
	IncorrectPassword
)
