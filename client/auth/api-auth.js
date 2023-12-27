export const login = async (user) => {
  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-auth] login", error)
  }
}

export const logout = async () => {
  try {
    const res = await fetch("/auth/logout", { method: "GET" })
    return await res.json()
  } catch (error) {
    console.error("[api-auth] logout", error)
  }
}

export const autoLogin = async () => {
  try {
    const res = await fetch("/auth/autologin", {
      method: "POST",
      headers: { Accept: "application/json" },
    })
    return await res.json()
  } catch (error) {
    console.error("[api-auth] autoLogin :", error)
  }
}

export const sendCaptcha = async (email) => {
  try {
    const res = await fetch("/auth/sendCaptcha", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-auth] autoLogin :", error)
  }
}
