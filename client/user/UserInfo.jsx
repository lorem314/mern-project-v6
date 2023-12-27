import React from "react"
import styled from "styled-components"

import UserAvatar from "./UserAvatar"

const Wrapper = styled.div`
  display: flex;
  > .avatar-wrapper {
    flex: 0 0 4rem;
  }
  > .info-wrapper {
    padding: 10px;
    flex: 1 1 auto;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    > .name {
      font-weight: bolder;
      font-size: 1.5rem;
    }
  }
  > .children-wrapper {
    display: flex;
    align-items: center;
  }
`

const UserInfo = ({ children = null, user, avatarSize = "100%" }) => {
  const { _id, name, email } = user
  return (
    <Wrapper>
      <div className="avatar-wrapper">
        <UserAvatar userId={_id} size={avatarSize} />
      </div>
      <div className="info-wrapper">
        <div className="name">{name}</div>
        <div className="email">{email}</div>
      </div>
      {children ? <div className="children-wrapper">{children}</div> : null}
    </Wrapper>
  )
}

export default UserInfo
