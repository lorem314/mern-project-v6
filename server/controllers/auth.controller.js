import jwt from "jsonwebtoken"
import { expressjwt } from "express-jwt"
import ms from "ms"
import nodemailer from "nodemailer"

import User from "../models/user.model"
import config from "../../config/config"
import redisClient from "../redis-server"

const login = async (req, res) => {
  const { email, password, hasExpiration, expiresIn } = req.body
  try {
    const user = await User.where({ email: email }).findOne()
    if (!user) return res.status(404).json({ error: "邮箱未被注册" })

    if (!user.authenticate(password))
      return res.status(403).json({ error: "密码不正确" })

    const options = {}
    if (hasExpiration) options.expiresIn = expiresIn
    const loginToken = jwt.sign({ _id: user._id }, config.jwtSecret, options)

    if (hasExpiration) {
      const maxAge = ms(expiresIn)
      const cookieOptions = { maxAge, httpOnly: true, secure: false }
      res.cookie("loginToken", loginToken, cookieOptions)
    }

    return res.json({
      loginToken,
      user: { _id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    return res.status(400).json({ error: "无法登录" })
  }
}

const logout = async (req, res) => {
  res.clearCookie("loginToken")
  return res.status(200).json({ message: "成功登出" })
}

const requireLogin = expressjwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.user && req.auth && req.user._id == req.auth._id
  if (!authorized) {
    return res.status("403").json({ error: "用户没有权限" })
  }
  next()
}

const autoLogin = async (req, res) => {
  const { loginToken } = req.cookies
  try {
    if (!loginToken) {
      return res.json({ error: "[authCtrl] 没有 loginToken 无法自动登录" })
    }

    jwt.verify(loginToken, config.jwtSecret, async (error, { _id }) => {
      if (error) {
        console.log("[authCtrl] autoLogin jwt.verify ", error)
        res.clearCookie("loginToken")
        return res.json({ error: "解析 loginToken 出错" })
      }

      const user = await User.findById(_id, "name email").exec()

      return res.json({ loginToken, user })
    })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法自动登录", err: error.toString() })
  }
}

const getEmailOptions = (email, captchaCode) => ({
  from: '"MERN" <MERN_universe@126.com>',
  to: email,
  subject: "MERN-Project-V6 验证码",
  text: `验证码:${captchaCode} 过期时间为 1 分钟`,
  html: `
    <h1>欢迎注册 MERN-Project-V6<h1>
    <h2>验证码为: ${captchaCode}</h2>
    <p>过期时间为 1 分钟 请尽快注册</p>
  `,
})
const sendCaptcha = async (req, res) => {
  const { email } = req.body
  console.log("send captcha to", email)
  try {
    const captchaCode = Math.random().toString().slice(-6)
    const result = await redisClient.setEx(`captcha_${email}`, 60, captchaCode)
    if (result === "OK") {
      const auth = { user: "MERN_universe", pass: "EUFXKTKYBFBBPYQY" }
      const options = getEmailOptions(email, captchaCode)
      nodemailer
        .createTransport({ service: "126", auth })
        .sendMail(options, (error, info) => {
          if (error) {
            return res.status(400).json({ error: "无法发送验证码" })
          }
          console.log("[auth.controller] sendCaptcha 成功该发送验证码 : ", code)
          console.log("[auth.controller] sendCaptcha : ", info)
          return res.status(200).json({ message: "验证码已发送" })
        })
    } else {
      return res.status(400).json({
        error: "将验证码存储在 Redis 中时发生错误",
      })
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const verifyCaptcha = async (req, res, next) => {
  const { email, captcha } = req.body
  try {
    const code = await redisClient.get(`captcha_${email}`)
    if (code === null) {
      return res.status(400).json({ error: "请先发送验证码", field: "captcha" })
    }
    console.log("captcha :", captcha)
    console.log("code    :", code)
    if (code == captcha) {
      console.log("[auth.controller] verifyCaptcha: matched")
      next()
      // return res.json({ message: "test" })
    } else {
      return res.status(400).json({ error: "验证码不匹配" })
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
}

export default {
  login,
  logout,
  requireLogin,
  hasAuthorization,
  autoLogin,
  sendCaptcha,
  verifyCaptcha,
}
