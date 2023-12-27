import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import styled from "styled-components"

import { read } from "./api-user"
import { useAuth } from "../auth/AuthContext"
import UserInfo from "./UserInfo"
import FollowButton from "./FollowButton"

const Wrapper = styled.div`
  background-color: white;
  max-width: 24rem;
  margin: 2rem auto;
  border: 1px solid transparent;
  padding: 0 1.5rem;

  > .levels {
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
    > .level {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > .title {
        margin: 0.25rem;
        font-size: 1.125rem;
      }
      > .count {
        margin: 0.25rem;
        font-size: 1.25rem;
      }
    }
  }
`

const User = () => {
  const { userId } = useParams()
  const { jwt } = useAuth()
  const [state, setState] = useState({
    user: null,
    isFollowing: false,
    followingCount: null,
    followersCount: null,
    postCount: null,
  })

  // read
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ userId, demanderId: jwt?.user._id }, signal).then((res) => {
      if (res.error) {
        console.error("[User] read", res)
      } else {
        console.log("[User] read", res)
        const {
          user,
          isFollowing,
          followingCount,
          followersCount,
          postCount,
          videoCount,
        } = res
        setState({
          user,
          isFollowing,
          followingCount,
          followersCount,
          postCount,
          videoCount,
        })
      }
    })

    return () => abortController.abort()
  }, [userId])

  const handleClickFollowButton = (api) => {
    api({ userId: jwt?.user._id }, { t: jwt?.token }, userId).then((res) => {
      if (res.error) {
        console.error("[Profile] handleClickFollowButton", res)
      } else {
        const { followersCount, isFollowing } = res
        setState((prevState) => ({ ...prevState, followersCount, isFollowing }))
      }
    })
  }

  const isMyself = jwt?.user._id == userId
  const {
    user,
    isFollowing,
    followingCount,
    followersCount,
    postCount,
    videoCount,
  } = state

  return user ? (
    <Wrapper>
      <h2>{isMyself ? "我的" : `用户 ${user.name} 的`}个人信息</h2>

      <UserInfo user={user}>
        {isMyself ? (
          <Link to={`/users/${userId}/edit`}>编辑</Link>
        ) : (
          <FollowButton
            onClick={handleClickFollowButton}
            isFollowing={isFollowing}
          />
        )}
      </UserInfo>

      <p>
        <span>简介：</span>
        <span>{user.about ? user.about : "这个人很懒，什么都没写..."}</span>
      </p>

      <div className="levels">
        <section className="level">
          <Link to={`/users/${userId}/followers`} className="title">
            粉丝
          </Link>
          <div className="count">{followersCount}</div>
        </section>
        <section className="level">
          <Link to={`/users/${userId}/following`} className="title">
            关注
          </Link>
          <div className="count">{followingCount}</div>
        </section>
        <section className="level">
          <Link to={`/posts/by/${userId}`} className="title">
            动态
          </Link>
          <div className="count">{postCount}</div>
        </section>
        <section className="level">
          <Link to={`/videos/by/${userId}`} className="title">
            视频
          </Link>
          <div className="count">{videoCount}</div>
        </section>
      </div>
    </Wrapper>
  ) : null
}

export default User
