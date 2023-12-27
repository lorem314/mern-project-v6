import React from "react"

import { useAuth } from "../auth/AuthContext"
import { remove } from "./api-comment"

const DeleteButton = ({
  commentId,
  parentModelName,
  parentObjectId,
  removeCommentById = () => {},
}) => {
  const { jwt } = useAuth()

  const handleClick = () => {
    remove(
      { commentId, parentModelName, parentObjectId },
      { t: jwt?.token }
    ).then((res) => {
      if (res.error) {
        console.error("[post: DeleteButton] remove :", res)
      } else {
        console.log("[DeleteButton] successfully deleted post:", res)
        console.log("[DeleteButton] comment ", commentId)
        removeCommentById(commentId)
      }
    })
  }

  return <button onClick={handleClick}>删除</button>
}

export default DeleteButton
