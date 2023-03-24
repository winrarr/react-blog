package utils

import (
	"api/auth"
	"log"
	"net/http"
)

func CreateStatusToHttpStatus(status auth.StatusMessage) (int, bool) {
	switch status {
	case auth.Success:
		return http.StatusCreated, true
	case auth.InternalError:
		return http.StatusInternalServerError, false
	case auth.UserAlreadyExists:
		return http.StatusConflict, false
	default:
		log.Fatal("unexpected auth create status")
	}
	return -1, false
}

func CheckStatusToHttpStatus(status auth.StatusMessage) (int, bool) {
	switch status {
	case auth.Success:
		return http.StatusOK, true
	case auth.InternalError:
		return http.StatusInternalServerError, false
	case auth.UserDoesNotExist:
		return http.StatusBadRequest, false
	case auth.IncorrectPassword:
		return http.StatusBadRequest, false
	default:
		log.Fatal("unexpected auth check status")
	}
	return -1, false
}

func RefreshStatusToHttpStatus(status auth.StatusMessage) (int, bool) {
	switch status {
	case auth.Success:
		return http.StatusOK, true
	case auth.InternalError:
		return http.StatusInternalServerError, false
	case auth.UserDoesNotExist:
		return http.StatusBadRequest, false
	case auth.InvalidToken:
		return http.StatusUnauthorized, false
	default:
		log.Fatal("unexpected auth refresh status")
	}
	return -1, false
}
