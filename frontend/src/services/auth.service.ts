import axios from 'axios'

const API_URL = "http://localhost:8080/"

class AuthService {
  async signIn(username: string, password: string) {
    const response = await axios.post(API_URL + "signin", {
      username,
      password,
    })

    if (response.data) {
      localStorage.setItem("session", JSON.stringify(response.data))
    }
  }

  signOut() {
    localStorage.removeItem("session")
  }

  async signUp(username: string, password: string) {
    const response = await axios.post(API_URL + "signup", {
      username,
      password,
    })

    if (response.data) {
      localStorage.setItem("session", JSON.stringify(response.data))
    }
  }

  getSession() {
    return localStorage.getItem("session")
  }
}

export default new AuthService()