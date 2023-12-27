export const create = async (video, credentials) => {
  try {
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: video,
    })
    return await res.json()
  } catch (error) {
    console.error("[api-video] create", error)
  }
}

export const listByUser = async (params, signal) => {
  const { userId, requesterId } = params
  try {
    const res = await fetch(
      `/api/videos/by/${userId}${
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
    console.error("[api-video] listByUser", error)
  }
}

export const read = async (params, signal) => {
  const { videoId, requesterId } = params
  try {
    const res = await fetch(
      `/api/videos/${videoId}${
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
    console.error("[api-video] read", error)
  }
}

export const remove = async (params, credentials) => {
  const { videoId } = params
  try {
    const res = await fetch(`/api/videos/${videoId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + credentials.t },
    })
    return await res.json()
  } catch (error) {
    console.error("[api-video] remove :", error)
  }
}

export const like = async (params, credentials) => {
  const { userId, videoId } = params
  try {
    const res = await fetch("/api/videos/like/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId, videoId }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-video] like :", error)
  }
}

export const unlike = async (params, credentials) => {
  const { userId, videoId } = params
  try {
    const res = await fetch("/api/videos/unlike/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId, videoId }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-video] unlike :", error)
  }
}
