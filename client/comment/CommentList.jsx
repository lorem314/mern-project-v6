import React, { useEffect, useState } from "react"
import styled from "styled-components"

import CommentItem from "./CommentItem"

const Wrapper = styled.section``

const CommentList = ({
  parentModelName = "Comment",
  parentObjectId,
  comments,
  removeCommentById,
}) => {
  return (
    <Wrapper>
      <h3>评论列表({comments.length})</h3>
      <ul className="no-style">
        {comments.map((comment) => {
          return (
            <CommentItem
              key={comment._id}
              parentModelName={parentModelName}
              parentObjectId={parentObjectId}
              comment={comment}
              removeCommentById={removeCommentById}
            />
          )
        })}
      </ul>
    </Wrapper>
  )
}

export default CommentList
