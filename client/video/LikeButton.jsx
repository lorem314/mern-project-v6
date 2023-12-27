import React, { useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../auth/AuthContext"
import { like, unlike } from "./api-video"

const LikeButton = ({ videoId, isLiked, likeCount }) => {
  const { jwt } = useAuth()
  const [state, setState] = useState({ isLiked, likeCount })

  const handleClick = () => {
    const api = state.isLiked ? unlike : like
    api({ userId: jwt?.user._id, videoId }, { t: jwt?.token }).then((res) => {
      if (res.error) {
        console.error("[LikeButton] video handleClick :", res.error)
      } else {
        setState(({ isLiked, likeCount }) => ({
          isLiked: !isLiked,
          likeCount: isLiked ? likeCount - 1 : likeCount + 1,
        }))
      }
    })
  }

  return jwt ? (
    <button onClick={handleClick}>
      {state.isLiked ? "💖" : "🤍"}
      {state.isLiked ? "已赞" : "赞"}({state.likeCount})
    </button>
  ) : (
    <Link to="/login">登录后可点赞</Link>
  )
}

export default LikeButton
