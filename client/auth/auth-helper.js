import { logout } from "./api-auth"

const auth = {
  isAuthenticated() {
    if (typeof window == "undefined") {
      return false
    }

    const jwt = sessionStorage.getItem("jwt")
    if (jwt) {
      return JSON.parse(jwt)
    } else {
      return false
    }
  },

  authenticate(jwt, cb) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jwt", JSON.stringify(jwt))
    }
    cb && cb()
  },

  update(user, cb) {
    if (typeof window !== "undefined") {
      const jwt = JSON.parse(sessionStorage.getItem("jwt"))
      sessionStorage.setItem("jwt", JSON.stringify({ ...jwt, user }))
    }
    cb && cb()
  },

  clearJWT(cb) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("jwt")
    }
    cb && cb()
    logout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
  },
}

export default auth
