import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

import UserInfo from "../user/UserInfo"
import PhotoList from "../photo/PhotoList"
import DeleteButton from "./DeleteButton"
import LikeButton from "./LikeButton"
import { getDateTime } from "../utils/date"

const Wrapper = styled.li`
  display: flex;
  flex-direction: column;
  > .post-created-by {
    margin-top: 0.5rem;
  }
  > .post-photos {
    margin: 0.5rem 1rem;
  }
  > .post-text {
    margin: 0.5rem 1rem;
    font-size: 1.225rem;
  }
  > .post-created-at {
    margin: 0.5rem 1rem;
    text-align: right;
  }
  > .actions {
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`

const PostItem = ({ post, isMyself, removePostById }) => {
  const cbAfterDelete = () => {
    removePostById(post._id)
  }
  return (
    <Wrapper>
      <div className="post-created-by">
        <UserInfo user={post.createdBy} />
      </div>
      <div className="post-photos">
        <PhotoList photos={post.photos} />
      </div>
      <p className="post-text">{post.text}</p>
      <div className="post-created-at">
        发布于 {getDateTime(post.createdAt)}
      </div>
      <div className="actions">
        <Link to={`/posts/${post._id}`}>评论({post.commentCount})</Link>
        <LikeButton
          postId={post._id}
          isLiked={post.isLiked}
          likeCount={post.likeCount}
        />
        {isMyself ? (
          <DeleteButton postId={post._id} cbAfterDelete={cbAfterDelete} />
        ) : null}
      </div>
    </Wrapper>
  )
}

export default React.memo(PostItem)
