import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styled from "styled-components"

import { read } from "./api-post"
import { useAuth } from "../auth/AuthContext"
import UserInfo from "../user/UserInfo"
import PhotoList from "../photo/PhotoList"
import DeleteButton from "./DeleteButton"
import LikeButton from "./LikeButton"
import NewComment from "../comment/NewComment"
import CommentList from "../comment/CommentList"

const Wrapper = styled.section`
  padding-bottom: 1rem;
  > .post-created-by {
    margin: 1rem 0;
  }
  > .post-text {
    font-size: 1.125rem;
  }
  > .actions {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`

const Post = () => {
  const { postId } = useParams()
  const { jwt } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState({
    post: null,
    isLiked: false,
  })

  // read
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ postId, requesterId: jwt?.user._id }, signal).then((res) => {
      if (res.error) {
        console.error("[Post] read:", res)
      } else {
        const { post, isLiked } = res
        // console.log("[Post] read post :", post)
        setState({ post, isLiked })
      }
    })

    return () => abortController.abort()
  }, [postId])

  const addComment = (comment) => {
    setState((prevState) => ({
      ...prevState,
      post: {
        ...prevState.post,
        comments: [comment, ...prevState.post.comments],
      },
    }))
  }

  const removeCommentById = (id) => {
    setState((prevState) => ({
      ...prevState,
      post: {
        ...prevState.post,
        comments: prevState.post.comments.filter(
          (comment) => comment._id !== id
        ),
      },
    }))
  }

  const cbAfterDelete = () => {
    navigate(`/posts/by/${jwt?.user._id}`)
  }

  const { post, isLiked } = state
  const isMyself = jwt?.user._id == post?.createdBy._id
  return post ? (
    <Wrapper className="route-page">
      <div className="post-created-by">
        <UserInfo user={post.createdBy} />
      </div>
      <PhotoList photos={post.photos} />
      <p className="post-text">{post.text}</p>
      <div className="actions">
        <LikeButton
          postId={post._id}
          isLiked={isLiked}
          likeCount={post.likeCount}
        />
        {isMyself ? (
          <DeleteButton postId={post._id} cbAfterDelete={cbAfterDelete} />
        ) : null}
      </div>

      <NewComment
        parentModelName="Post"
        parentObjectId={post._id}
        addComment={addComment}
      />

      <CommentList
        parentModelName="Post"
        parentObjectId={post._id}
        comments={post.comments}
        removeCommentById={removeCommentById}
      />
    </Wrapper>
  ) : null
}

export default Post
