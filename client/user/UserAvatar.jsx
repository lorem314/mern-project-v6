import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Wrapper = styled.div`
  .user-avatar {
    width: ${({ size }) => size};
  }
`

const UserAvatar = ({ userId = null, size = "100%" }) => {
  const src = userId
    ? `/api/user/avatar?userId=${userId}&t=${new Date().getTime()}`
    : "/api/user/avatar/default"
  return (
    <Wrapper size={size}>
      <Link to={`/users/${userId}`}>
        <img className="user-avatar" src={src} alt="用户头像" />
      </Link>
    </Wrapper>
  )
}

export default UserAvatar
