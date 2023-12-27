import React, { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useForm } from "react-hook-form"

import { create, captcha } from "./api-user"
import Timer from "../components/Timer"

const Wrapper = styled.section`
  background-color: white;
  max-width: 24rem;
  margin: 2rem auto;
  border: 1px solid transparent;
  padding: 0 1.5rem;

  > form {
    padding: 0 2rem;

    > div {
      > div.error {
        margin-top: 0.25rem;
        color: red;
        font-size: smaller;
        text-align: right;
      }
    }

    > .actions {
      margin: 1rem 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
`

const Signup = () => {
  const navigate = useNavigate()
  const [hasCaptchaSent, setHasCaptchaSent] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { isShowPassword: false, email: "" },
  })
  const isShowPassword = watch("isShowPassword")

  const sendCaptcha = async () => {
    const isValidEmail = await trigger("email", { shouldFocus: true })
    if (!isValidEmail) return

    const email = getValues("email")
    console.log("send email")
    captcha(email).then((res) => {
      if (res.error) {
        console.log("[Signup] captcha", res)
        setError("captcha", { type: "custom", message: res.error })
      } else {
        console.log(res.message)
        setHasCaptchaSent(true)
      }
    })
  }

  const handleTimeout = useCallback(() => {
    setHasCaptchaSent(false)
  }, [])

  const onSubmit = (data) => {
    console.log("[Signup] onSubmit before create", data)
    create(data).then((res) => {
      if (res.error) {
        const { error, field } = res
        console.error("[Signup] onSubmit create", error)
        setError(field, { type: "custom", message: error })
      } else {
        console.log("[Signup] onSubmit create", res.message)
        navigate("/login")
      }
    })
  }

  console.log("[Signup] before render, errors", errors)
  return (
    <Wrapper>
      <h2>注册</h2>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        {/*  */}

        <div className="label-input-group">
          <label htmlFor="">用户名</label>
          <input
            type="text"
            autoComplete="off"
            {...register("name", { minLength: 5, maxLength: 50 })}
          />
        </div>

        <div className="label-input-group">
          <label htmlFor="">邮箱</label>
          <input
            type="email"
            autoComplete="off"
            {...register("email", {
              pattern: { value: /.+\@.+\..+/, message: "邮箱格式不正确" },
              required: "邮箱不能为空",
            })}
          />
          <div className="error">
            {errors.email ? errors.email.message : null}
          </div>
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
                {...register("isShowPassword", {
                  minLength: { value: 6, message: "密码不能少于 6 个字符" },
                })}
              />
              <span style={{ flex: "0 0 auto" }}>显示密码</span>
            </label>
          </div>
        </div>

        <div className="label-input-group">
          <label htmlFor="">验证码</label>
          <div className="input-button-group">
            <input type="text" {...register("captcha")} />
            <button type="button" onClick={sendCaptcha}>
              {hasCaptchaSent ? (
                <Timer duration="60000" onTimeout={handleTimeout} />
              ) : (
                "发送验证码"
              )}
            </button>
          </div>
          <div className="error">
            {errors.captcha ? errors.captcha.message : null}
          </div>
        </div>

        <div className="actions">
          <Link to="/login">已有帐号</Link>
          <button type="submit">注册</button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Signup
