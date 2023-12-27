export const create = async (user) => {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-user] create", error)
  }
}

export const read = async (params, signal) => {
  const { userId, demanderId } = params
  try {
    const res = await fetch(
      `/api/users/${userId}${demanderId ? `?demanderId=${demanderId}` : ""}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
      }
    )
    return await res.json()
  } catch (error) {
    console.error("[api-user] read", error)
  }
}

export const update = async (params, credentials, user) => {
  const { userId } = params
  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: user,
    })
    return await res.json()
  } catch (error) {
    console.error("[api-user] update :", error)
  }
}

export const list = async (signal) => {
  try {
    const res = await fetch("/api/users/", { method: "GET", signal: signal })
    return await res.json()
  } catch (err) {
    console.log(err)
  }
}

export const follow = async (params, credentials, followId) => {
  const { userId } = params
  try {
    const res = await fetch("/api/users/follow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId, followId }),
    })
    return await res.json()
  } catch (err) {
    console.log(err)
  }
}
export const unfollow = async (params, credentials, unfollowId) => {
  const { userId } = params
  try {
    const res = await fetch("/api/users/unfollow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId, unfollowId }),
    })
    return await res.json()
  } catch (err) {
    console.log(err)
  }
}

export const listFollowing = async (params, signal) => {
  const { userId } = params
  try {
    const res = await fetch(`/api/user/following?userId=${userId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    })
    return await res.json()
  } catch (error) {
    console.error("[api-user] listFollowing", error)
  }
}
export const listFollowers = async (params, signal) => {
  const { userId } = params
  try {
    const res = await fetch(`/api/user/followers?userId=${userId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    })
    return await res.json()
  } catch (error) {
    console.error("[api-user] listFollowers", error)
  }
}

export const captcha = async (email) => {
  try {
    const res = await fetch(`/auth/send-captcha`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-user] captcha :", error)
  }
}
