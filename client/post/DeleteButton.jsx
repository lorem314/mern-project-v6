import React from "react"

import { useAuth } from "../auth/AuthContext"
import { remove } from "./api-post"

const DeleteButton = ({ postId, cbAfterDelete = () => {} }) => {
  const { jwt } = useAuth()

  const handleClick = () => {
    remove({ postId }, { t: jwt?.token }).then((res) => {
      if (res.error) {
        console.error("[post: DeleteButton] remove :", res)
      } else {
        console.log("[DeleteButton]", postId)
        cbAfterDelete()
      }
    })
  }

  return <button onClick={handleClick}>删除</button>
}

export default DeleteButton
