import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import styled from "styled-components"
import { useAuth } from "../auth/AuthContext"

import NewPost from "./NewPost"
import PostList from "./PostList"
import { listByUser } from "./api-post"

const Wrapper = styled.section`
  padding-bottom: 1rem;
`

const PostsBy = () => {
  const { jwt } = useAuth()
  const { userId } = useParams()
  const [state, setState] = useState({
    posts: [],
    createdBy: {},
    isLoading: true,
  })

  // listByUser
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByUser({ userId, requesterId: jwt?.user._id }, signal).then((res) => {
      if (res.error) {
        console.error("[PostsBy] listByUser :", res)
      } else {
        const { createdBy, posts } = res
        setState((prevState) => ({
          ...prevState,
          createdBy,
          posts,
        }))
      }
    })

    return () => abortController.abort()
  }, [userId])

  const addPost = (post) => {
    setState((prevState) => ({
      ...prevState,
      posts: [post, ...prevState.posts],
    }))
  }

  const removePostById = (removedPostId) => {
    setState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.filter((post) => post._id !== removedPostId),
      }
    })
  }

  const isMyself = jwt?.user._id == userId
  const { posts, createdBy } = state

  return createdBy._id ? (
    <Wrapper className="route-page">
      <h2>{isMyself ? "我的" : `用户 ${createdBy.name} 的`}动态</h2>

      {isMyself ? <NewPost addPost={addPost} /> : null}

      <h3>动态列表({posts.length})</h3>
      <PostList
        posts={posts}
        isMyself={isMyself}
        removePostById={removePostById}
      />
    </Wrapper>
  ) : null
}

export default PostsBy
