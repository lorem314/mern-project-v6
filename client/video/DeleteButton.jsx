import React from "react"

import { useAuth } from "../auth/AuthContext"
import { remove } from "./api-video"

const DeleteButton = ({ videoId, cbAfterDelete = () => {} }) => {
  const { jwt } = useAuth()

  const handleClick = () => {
    remove({ videoId }, { t: jwt?.token }).then((res) => {
      if (res.error) {
        console.error("[post: DeleteButton] remove :", res)
      } else {
        console.log("[DeleteButton] video, deletedVideoId", videoId)
        cbAfterDelete()
      }
    })
  }

  return <button onClick={handleClick}>删除</button>
}

export default DeleteButton
