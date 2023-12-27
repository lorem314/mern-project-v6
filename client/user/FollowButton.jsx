import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

import { useAuth } from "../auth/AuthContext"
import { follow, unfollow } from "./api-user"

const FollowButton = ({ isFollowing = false, onClick = () => {} }) => {
  const { jwt } = useAuth()
  const handleClickFollow = () => onClick(follow)
  const handleClickUnfollow = () => onClick(unfollow)

  return jwt ? (
    isFollowing ? (
      <button onClick={handleClickUnfollow}>取消关注</button>
    ) : (
      <button onClick={handleClickFollow}>关注</button>
    )
  ) : (
    <Link to="/login">登录后可关注</Link>
  )
}

export default FollowButton
