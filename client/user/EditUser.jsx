import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { useForm } from "react-hook-form"

import { useAuth } from "../auth/AuthContext"
import { read, update } from "./api-user"
import UserAvatar from "./UserAvatar"

const Wrapper = styled.div`
  background-color: white;
  max-width: 24rem;
  margin: 2rem auto;
  border: 1px solid transparent;
  padding: 0 1.5rem;

  > form {
    > .avatar-section {
      > .old-avatar,
      .new-avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
    }

    > section {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;
    }

    > .actions {
      margin: 1rem 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
`

const EditUser = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { jwt, updateUser } = useAuth()
  const [user, setUser] = useState(null)
  const {
    register,
    getValues,
    watch,
    reset,
    formState: { dirtyFields },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: { avatar: null, isShowPassword: false },
  })
  const isShowPassword = watch("isShowPassword")
  const watchAvatar = watch("avatar")
  const hasNewAvatar = watchAvatar?.length === 1

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ userId }, signal).then((res) => {
      if (res.error) {
        console.error("[EditUser] read", res)
      } else {
        const { user } = res
        setUser(user)
      }
    })

    return () => abortController.abort()
  }, [userId])

  const resetNewAvatar = () => reset({ avatar: null })

  const onSubmit = (data) => {
    const formData = new FormData()
    Object.keys(dirtyFields).forEach((key) => {
      console.log(`${key} is dirty`)
      if (key == "avatar") {
        formData.append(key, data[key][0])
      } else {
        formData.append(key, data[key])
      }
    })
    update({ userId }, { t: jwt.token }, formData).then((res) => {
      if (res.error) {
        console.error("[EditUser] update", res)
      } else {
        const { user } = res
        updateUser(user)
        navigate(`/users/${user._id}`)
      }
    })
  }

  const newAvatar = getValues("avatar")
  return user ? (
    <Wrapper>
      <h2>编辑个人信息</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/*  */}

        <section className="avatar-section">
          <div className="old-avatar">
            <UserAvatar userId={user._id} size="4rem" />
            <label className="button" htmlFor="upload-avatar">
              更改头像
            </label>
            <input
              type="file"
              accept="image/*"
              name="avatar"
              id="upload-avatar"
              {...register("avatar")}
            />
          </div>
          {hasNewAvatar ? (
            <>
              <div style={{ fontSize: "3rem" }}>&rarr;</div>
              <div className="new-avatar">
                <img
                  className="new-avatar"
                  style={{ width: "4rem" }}
                  src={URL.createObjectURL(newAvatar[0])}
                  alt="新头像"
                />
                <button type="button" onClick={resetNewAvatar}>
                  取消更改
                </button>
              </div>
            </>
          ) : null}
        </section>

        <div className="label-input-group">
          <label htmlFor="">ID</label>
          <input type="text" value={user._id} readOnly />
        </div>

        <div className="label-input-group">
          <label htmlFor="">用户名</label>
          <input type="text" {...register("name", { value: user.name })} />
        </div>

        <div className="label-input-group">
          <label htmlFor="">邮箱</label>
          <input type="text" {...register("email", { value: user.email })} />
        </div>

        <div className="label-input-group">
          <label htmlFor="">密码</label>
          <div className="input-button-group">
            <input
              type={isShowPassword ? "text" : "password"}
              autoComplete="off"
              {...register("password")}
            />
            <label
              htmlFor="is-show-password"
              className="inline-flex"
              style={{ flex: " 1 0 auto" }}
            >
              <input
                id="is-show-password"
                type="checkbox"
                {...register("isShowPassword")}
              />
              <span style={{ flex: "0 0 auto" }}>显示密码</span>
            </label>
          </div>
        </div>

        <div className="label-input-group">
          <label htmlFor="">简介</label>
          <textarea
            className="resize-v"
            rows="2"
            {...register("about", { value: user.about })}
          />
        </div>

        <div className="actions">
          <Link to="..">返回</Link>
          <button type="submit">提交</button>
        </div>
      </form>
    </Wrapper>
  ) : null
}

export default EditUser
