import axios from 'axios'
import { IAuth } from '../@types/auth'

const API_URL = "http://localhost:8080/"

class AuthService {
  async signIn(username: string, password: string): Promise<IAuth | null> {
    const { data, status } = await axios.post<IAuth>(API_URL + "signin", {
      username,
      password,
    })

    if (status == axios.HttpStatusCode.Ok) {
      return data
    }

    return null
  }

  signOut() {
    localStorage.removeItem("session")
  }

  async signUp(username: string, password: string): Promise<IAuth | null> {
    const { data, status } = await axios.post<IAuth>(API_URL + "signup", {
      username,
      password,
    })

    if (status == axios.HttpStatusCode.Created) {
      return data
    }

    return null
  }

  getSession() {
    return localStorage.getItem("session")
  }
}

export default new AuthService()