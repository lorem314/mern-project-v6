import React from "react"
import styled from "styled-components"
import { useForm } from "react-hook-form"

import { useAuth } from "../auth/AuthContext"
import { create } from "./api-comment"

const Wrapper = styled.section`
  > form {
    > .actions {
      display: flex;
      justify-content: flex-end;
    }
  }
`

const NewComment = ({ parentModelName, parentObjectId, addComment }) => {
  const { jwt } = useAuth()
  const { register, handleSubmit, getValues, setValue, reset } = useForm({
    mode: "onChange",
    defaultValues: {},
  })

  const onSubmit = (data) => {
    const { text } = data
    create(
      { parentModelName, parentObjectId },
      { t: jwt?.token },
      { text }
    ).then((res) => {
      if (res.error) {
        console.error("[NewComment] create", res)
      } else {
        const { comment } = res
        console.log("success", comment)
        addComment(comment)
        reset()
      }
    })
  }

  return (
    <Wrapper>
      <h3>发表评论</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea className="resize-v" rows="4" {...register("text")} />
        <div className="actions">
          <button type="submit">评论</button>
        </div>
      </form>
    </Wrapper>
  )
}

export default NewComment
