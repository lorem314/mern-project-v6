import React, { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

import UserInfo from "../user/UserInfo"
import { useAuth } from "../auth/AuthContext"
import NewReply from "./NewReply"
import LikeButton from "./LikeButton"
import DeleteButton from "./DeleteButton"
import CommentList from "./CommentList"
import { listReplies } from "./api-comment"
import { getDateTime } from "../utils/date"

const Wrapper = styled.li`
  .comment-text {
    margin: 0 0.5rem 1rem;
  }

  .comment-created-at {
    text-align: right;
    margin: 0.5rem 0;
  }

  .actions {
    padding: 0 10px;

    display: flex;
    font-size: smaller;
    justify-content: space-between;
    align-items: center;
  }
`

const CommentItem = ({
  comment,
  parentModelName,
  parentObjectId,
  removeCommentById,
}) => {
  const commentId = comment._id
  const [state, setState] = useState({
    areRepliesLoaded: false,
    replies: [],
    isReplying: false,
  })
  const { jwt } = useAuth()

  const toggleIsReplying = () => {
    setState((prevState) => ({
      ...prevState,
      isReplying: !prevState.isReplying,
    }))
  }

  const loadReplies = () => {
    listReplies({ commentId, requesterId: jwt?.user._id }).then((res) => {
      if (res.error) {
        console.error("[CommentItem] loadReplies", res)
      } else {
        const { replies } = res
        console.log(res.message)
        setState((prevState) => ({
          ...prevState,
          replies,
          areRepliesLoaded: true,
        }))
      }
    })
  }

  const addReply = (reply) => {
    console.log("addReply", reply)
    console.log("prev ", state.replies)
    console.log("next ", [reply, ...state.replies])
    setState((prevState) => ({
      ...prevState,
      isReplying: false,
      replies: [reply, ...prevState.replies],
    }))
  }

  const removeReplyById = (id) => {
    console.log("removeReplyById", id)
    console.log("prev ", state.replies)
    console.log(
      "next ",
      state.replies.filter((reply) => reply._id !== id)
    )
    setState((prevState) => ({
      ...prevState,
      replies: prevState.replies.filter((reply) => reply._id !== id),
    }))
  }

  const { areRepliesLoaded, isReplying, replies } = state
  console.log("[CommentItem] before render ", commentId)
  console.log("replies", replies)

  const isMyself = comment.createdBy._id == jwt?.user._id

  return (
    <Wrapper>
      <UserInfo user={comment.createdBy} />

      <div style={{ marginLeft: "4rem" }}>
        <p className="comment-text">{comment.text}</p>

        <div className="comment-created-at">
          发布于 {getDateTime(comment.createdAt)}
        </div>

        <div className="actions">
          {jwt ? (
            <button onClick={toggleIsReplying}>
              {isReplying ? "关闭评论" : "评论"}
            </button>
          ) : null}

          {jwt ? (
            <LikeButton
              commentId={comment._id}
              isLiked={comment.isLiked}
              likeCount={comment.likeCount}
            />
          ) : null}

          {isMyself ? (
            <DeleteButton
              commentId={comment._id}
              parentModelName={parentModelName}
              parentObjectId={parentObjectId}
              removeCommentById={removeCommentById}
            />
          ) : null}

          {comment.commentCount !== 0 && !areRepliesLoaded ? (
            <button onClick={loadReplies}>
              加载{comment.commentCount}条评论
            </button>
          ) : null}
        </div>

        {jwt && isReplying ? (
          <NewReply
            parentModelName="Comment"
            parentObjectId={commentId}
            addReply={addReply}
          />
        ) : null}

        {areRepliesLoaded || replies.length !== 0 ? (
          <CommentList
            comments={replies}
            parentModelName="Comment"
            parentObjectId={commentId}
            removeCommentById={removeReplyById}
          />
        ) : null}
      </div>
    </Wrapper>
  )
}

export default CommentItem
