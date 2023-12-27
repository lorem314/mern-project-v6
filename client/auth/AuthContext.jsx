import React, { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"

import { autoLogin, logout } from "./api-auth"

const AuthContext = createContext({})

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const [state, setState] = useState({
    loginToken: null,
    user: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  const authenticate = ({ loginToken, user }, cb = () => {}) => {
    setState((prevState) => ({ ...prevState, loginToken, user }))
    cb()
  }

  const updateUser = ({ _id, name, email }) => {
    const loginInfo = sessionStorage.getItem("loginInfo")
    if (loginInfo) {
      const { loginToken, user } = JSON.parse(loginInfo)
      sessionStorage.setItem(
        "loginInfo",
        JSON.stringify({ loginToken, user: { _id, name, email } })
      )
    }
    setState((prevState) => ({ ...prevState, user: { _id, name, email } }))
  }

  const clearJWT = () => {
    logout().then((res) => {
      if (res.error) {
        console.error("[AuthContext] clearJWT logout:", res.error)
      } else {
        // console.log("[AuthContext]", res.message)
        // sessionStorage.removeItem("jwt")
        setState((prevState) => ({
          ...prevState,
          loginToken: null,
          user: null,
        }))
        navigate("/")
      }
    })
  }

  useEffect(() => {
    const loginInfo = sessionStorage.getItem("loginInfo")
    if (loginInfo) {
      const { loginToken, user } = JSON.parse(loginInfo)
      setState((prevState) => ({ ...prevState, loginToken, user }))
      setIsLoading(false)
    } else {
      autoLogin()
        .then((res) => {
          if (res.error) {
            const loginToken = null
            const user = null
            setState((prevState) => ({ ...prevState, loginToken, user }))
          } else {
            authenticate(res)
          }
        })
        .then(() => {
          setIsLoading(false)
        })
    }
  }, [])

  const { loginToken, user } = state
  return (
    <AuthContext.Provider
      value={{
        jwt: loginToken && user ? { token: loginToken, user } : null,
        authenticate,
        updateUser,
        clearJWT,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
