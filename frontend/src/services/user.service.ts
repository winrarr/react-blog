import axios from 'axios'
import authHeader from './auth-header'

const API_URL = "http://localhost:8080/"

class UserService {
    getUsers() {
        return axios.get(API_URL + "users", { headers: authHeader() })
    }
}

export default new UserService()