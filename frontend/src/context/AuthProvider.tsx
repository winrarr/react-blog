import { createContext, useState } from "react"
import { AuthContextType, IAuth } from "../@types/auth"

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState<IAuth>({
    session: "",
    userLevel: 0,
  })

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext