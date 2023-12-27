import React, { useEffect, useState } from "react"
import styled from "styled-components"

import { list } from "./api-user"
import UserInfo from "./UserInfo"

const Wrapper = styled.div`
  /* background-color: white; */
  max-width: 32rem;
  margin: 2rem auto;
  border: 1px solid transparent;
  padding: 0 1.5rem;
  > h2 {
    background-color: white;
    padding: 1rem 1.5rem;
    margin: 1rem 0;
  }
  > .user-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    > li {
      background-color: white;
      padding: 0.75rem 0.5rem 0.5rem;
      > .about {
        padding: 0 1rem;
      }
    }
  }
`

const Users = () => {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((res) => {
      if (res.error) {
        console.error("[Profile] read", res.error)
      } else {
        const { users } = res
        setUsers(users)
      }
    })

    return () => abortController.abort()
  }, [])

  return users ? (
    <Wrapper className="">
      <h2>用户列表({users.length})</h2>
      <ul className="no-style user-list">
        {users.map((user) => {
          return (
            <li key={user._id}>
              <UserInfo user={user} />
              {user.about ? (
                <p className="about">
                  {" "}
                  <span>简介：</span> {user.about}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </Wrapper>
  ) : null
}

export default Users
