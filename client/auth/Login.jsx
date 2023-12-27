import React from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useForm } from "react-hook-form"

import { login } from "./api-auth"
import { useAuth } from "./AuthContext"

const Wrapper = styled.section`
  background-color: white;
  max-width: 24rem;
  margin: 2rem auto;
  border: 1px solid transparent;
  padding: 0 1.5rem;

  > form {
    padding: 0 2rem;

    > .actions {
      margin: 1rem 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
`

const Login = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const { register, watch, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "user001@gmail.com",
      password: "user001",
      hasExpiration: false,
      expiresIn: "1d",
    },
  })
  const hasExpiration = watch("hasExpiration")

  const submit = (data) => {
    const { email, password, hasExpiration, expiresIn } = data
    const form = {}
    form.email = email
    form.password = password
    form.hasExpiration = hasExpiration
    if (data.hasExpiration) form.expiresIn = expiresIn
    login(form).then((res) => {
      if (res.error) {
        console.error("[Login] login", res)
      } else {
        console.log("成功登录")
        if (!hasExpiration) {
          sessionStorage.setItem("loginInfo", JSON.stringify(res))
        }
        auth.authenticate(res, () => navigate("/"))
      }
    })
  }

  return (
    <Wrapper>
      <h2>登录</h2>
      <form onSubmit={handleSubmit(submit)}>
        {/*  */}

        <div className="label-input-group">
          <label htmlFor="">邮箱</label>
          <input type="email" {...register("email")} />
        </div>

        <div className="label-input-group">
          <label htmlFor="">密码</label>
          <input type="password" autoComplete="off" {...register("password")} />
        </div>

        <div className="flex" style={{ margin: "0.5rem 0", lineHeight: "1.5" }}>
          <input
            type="checkbox"
            id="expires-in"
            {...register("hasExpiration")}
          />
          <label
            htmlFor="expires-in"
            style={{ flexGrow: "1", margin: "0.25rem" }}
          >
            记住我
          </label>
          {hasExpiration ? (
            <select style={{ flexBasis: "120px" }} {...register("expiresIn")}>
              <option value="15s">15秒</option>
              <option value="1d">1天</option>
              <option value="7d">7天</option>
              <option value="99y">永久(不推荐)</option>
            </select>
          ) : null}
        </div>

        <div className="actions">
          <Link to="/signup">没有帐号</Link>
          <button type="submit">登录</button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Login
