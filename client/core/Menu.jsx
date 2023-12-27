import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"

import { useAuth } from "../auth/AuthContext"

const Wrapper = styled.header`
  background-color: rebeccapurple;
  height: 50px;
  padding: 0 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > .site-title {
    margin: 0;
    font-size: 1.125rem;
    > .home-link {
      text-decoration: none;
    }
  }

  > nav {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

const Menu = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  const { jwt } = auth
  return (
    <Wrapper>
      <h1 className="site-title">
        <Link className="home-link" to="/">
          MERN-Project-V6
        </Link>
      </h1>
      <nav>
        {!jwt && (
          <>
            <Link to="/signup">注册</Link>
            <Link to="/login">登录</Link>
          </>
        )}
        {jwt && (
          <>
            <Link to="/users">所有用户</Link>
            <Link to={`/users/${jwt.user._id}`}>{jwt.user.name}</Link>
            <button
              onClick={() => {
                auth.clearJWT(() => {
                  navigate("/")
                })
              }}
            >
              登出
            </button>
          </>
        )}
      </nav>
    </Wrapper>
  )
}

export default Menu

function withRouter(Component) {
  return function (props) {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    return <Component {...props} router={{ location, navigate, params }} />
  }
}
