export const create = async (params, credentials, comment) => {
  const { parentModelName, parentObjectId } = params
  try {
    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify({
        comment,
        parentModelName,
        parentObjectId,
      }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-comment] create :", error)
  }
}

export const like = async (params, credentials) => {
  const { commentId } = params
  try {
    const res = await fetch("/api/comments/like", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify({ commentId }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-comment] like :", error)
  }
}

export const unlike = async (params, credentials) => {
  const { commentId } = params
  try {
    const res = await fetch("/api/comments/unlike", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify({ commentId }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-comment] unlike :", error)
  }
}

export const remove = async (params, credentials) => {
  const { commentId, parentModelName, parentObjectId } = params
  try {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: JSON.stringify({ commentId, parentModelName, parentObjectId }),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-comment] remove :", error)
  }
}

export const listReplies = async (params) => {
  const { commentId, requesterId } = params
  try {
    const res = await fetch(
      `/api/comments/${commentId}/replies${
        requesterId ? `?requesterId=${requesterId}` : ""
      }`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
    return await res.json()
  } catch (error) {
    console.error("[api-comment] listReplies :", error)
  }
}
