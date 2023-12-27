import React, { useState } from "react"

import { useAuth } from "../auth/AuthContext"
import { like, unlike } from "./api-comment"

const LikeButton = ({ commentId, isLiked = false, likeCount = -999 }) => {
  const { jwt } = useAuth()
  const [state, setState] = useState({ isLiked, likeCount })

  const handleClick = () => {
    const api = state.isLiked ? unlike : like
    api({ commentId }, { t: jwt?.token }).then((res) => {
      if (res.error) {
        console.error("[LikeButton] handleClick :", res)
      } else {
        setState(({ isLiked, likeCount }) => ({
          isLiked: !isLiked,
          likeCount: isLiked ? likeCount - 1 : likeCount + 1,
        }))
      }
    })
  }

  return (
    <button onClick={handleClick}>
      {state.isLiked ? "💖" : "🤍"}
      {state.isLiked ? "已赞" : "赞"}({state.likeCount})
    </button>
  )
}

export default LikeButton
