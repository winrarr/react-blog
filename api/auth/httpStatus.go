package auth

import (
	"log"
	"net/http"
)

func CreateStatusToHttpStatus(status StatusMessage) (int, bool) {
	switch status {
	case Success:
		return http.StatusCreated, true
	case InternalError:
		return http.StatusInternalServerError, false
	case UserAlreadyExists:
		return http.StatusConflict, false
	default:
		log.Fatal("unexpected auth create status")
	}
	return -1, false
}

func CheckStatusToHttpStatus(status StatusMessage) (int, bool) {
	switch status {
	case Success:
		return http.StatusOK, true
	case InternalError:
		return http.StatusInternalServerError, false
	case UserNotFound:
		return http.StatusBadRequest, false
	case IncorrectPassword:
		return http.StatusBadRequest, false
	default:
		log.Fatal("unexpected auth check status")
	}
	return -1, false
}

func RefreshStatusToHttpStatus(status StatusMessage) (int, bool) {
	switch status {
	case Success:
		return http.StatusOK, true
	case InternalError:
		return http.StatusInternalServerError, false
	case UserNotFound:
		return http.StatusBadRequest, false
	case InvalidToken:
		return http.StatusUnauthorized, false
	case RefreshTokenExpired:
		return http.StatusUnauthorized, false
	default:
		log.Fatal("unexpected auth refresh status")
	}
	return -1, false
}

func LogoutStatusToHttpStatus(status StatusMessage) (int, bool) {
	switch status {
	case Success:
		return http.StatusOK, true
	case InvalidToken:
		return http.StatusBadRequest, false
	case UserNotFound:
		return http.StatusBadRequest, false
	default:
		log.Fatal("unexpected auth refresh status")
	}
	return -1, false
}
