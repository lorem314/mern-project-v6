import React from "react"
import styled from "styled-components"

import PostItem from "./PostItem"
import { useAuth } from "../auth/AuthContext"

const Wrapper = styled.ul`
  --border-color: lightgrey;
  > li {
    border: 1px solid var(--border-color);
    border-bottom: none;
  }
  > li:last-child {
    border-bottom: 1px solid var(--border-color);
  }
`

const PostList = ({ posts, isMyself, removePostById }) => {
  return (
    <Wrapper className="no-style">
      {posts.map((post) => {
        return (
          <PostItem
            key={post._id}
            post={post}
            isMyself={isMyself}
            removePostById={removePostById}
          />
        )
      })}
    </Wrapper>
  )
}

export default PostList
