import express from "express"

import authCtrl from "../controllers/auth.controller"

const router = express.Router()

router.route("/auth/login").post(authCtrl.login)

router.route("/auth/autologin").post(authCtrl.autoLogin)

router.route("/auth/logout").get(authCtrl.logout)

router.route("/auth/send-captcha").post(authCtrl.sendCaptcha)

export default router
