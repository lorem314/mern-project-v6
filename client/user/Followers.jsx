import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"

import { listFollowers } from "./api-user"
import UserInfo from "./UserInfo"
import { useAuth } from "../auth/AuthContext"

const Wrapper = styled.div`
  padding: 0 1.5rem 1rem;
`

const Followers = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const { jwt } = useAuth()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listFollowers({ userId }, signal).then((res) => {
      if (res.error) {
        console.error("[Followers] listFollowers :", res)
      } else {
        const { user } = res
        setUser(user)
      }
    })

    return () => abortController.abort()
  }, [userId])

  const isMyself = jwt?.user?._id == userId

  return user ? (
    <Wrapper className="route-page">
      <h2>
        {isMyself ? "我的" : `用户 ${user.name} 的`}粉丝({user.followers.length}
        )
      </h2>
      <ul className="no-style">
        {user.followers.map((user) => {
          return (
            <li key={user._id}>
              <UserInfo user={user} />
            </li>
          )
        })}
      </ul>
    </Wrapper>
  ) : null
}

export default Followers
