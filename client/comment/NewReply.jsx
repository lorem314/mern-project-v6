import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import styled from "styled-components"

import { useAuth } from "../auth/AuthContext"
import UserAvatar from "../user/UserAvatar"
import { create } from "./api-comment"

const Wrapper = styled.div`
  margin-top: 0.5rem;

  display: flex;
  align-items: center;

  > form {
    flex: 1 0 auto;
    display: flex;
    align-items: center;

    > button {
      flex: 0 0 auto;
    }
  }
`

const NewReply = ({ parentModelName, parentObjectId, addReply = () => {} }) => {
  const { jwt } = useAuth()
  const { register, handleSubmit, getValues, setValue, reset } = useForm({
    mode: "onChange",
    defaultValues: { text: "" },
  })

  const onSubmit = (data) => {
    const { text } = data
    create(
      { parentModelName, parentObjectId },
      { t: jwt?.token },
      { text }
    ).then((res) => {
      if (res.error) {
        console.error("[NewReply] create", res)
      } else {
        const { comment } = res
        reset()
        addReply(comment)
      }
    })
  }

  return (
    <Wrapper>
      <UserAvatar userId={jwt?.user._id} size="3rem" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" autoFocus {...register("text")} />
        <button>回复</button>
      </form>
    </Wrapper>
  )
}

export default NewReply
