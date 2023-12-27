export const create = async (post, credentials) => {
  try {
    const res = await fetch(`/api/posts/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: post,
    })
    return await res.json()
  } catch (err) {
    console.error("[api-post] create :", err)
  }
}

export const listByUser = async (params, signal) => {
  const { userId, requesterId } = params
  try {
    const res = await fetch(
      `/api/posts/by/${userId}${
        requesterId ? `?requesterId=${requesterId}` : ""
      }`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
      }
    )
    return await res.json()
  } catch (error) {
    console.error("[api-post] listByUser :", error)
  }
}

export const read = async (params, signal) => {
  const { postId, requesterId } = params
  try {
    const res = await fetch(
      `/api/posts/${postId}${requesterId ? `?requesterId=${requesterId}` : ""}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
      }
    )
    return await res.json()
  } catch (error) {
    console.error("[api-post] read :", error)
  }
}

export const remove = async (params, credentials) => {
  const { postId } = params
  try {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + credentials.t },
    })
    return await res.json()
  } catch (error) {
    console.error("[api-post] remove :", error)
  }
}

export const like = async (params, credentials) => {
  const { userId, postId } = params
  try {
    const res = await fetch("/api/posts/like/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId, postId }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-post] like :", error)
  }
}

export const unlike = async (params, credentials) => {
  const { userId, postId } = params
  try {
    const res = await fetch("/api/posts/unlike/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId, postId }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-post] unlike :", error)
  }
}
