import express from "express"

import authCtrl from "../controllers/auth.controller"
import userCtrl from "../controllers/user.controller"

const router = express.Router()

router
  .route("/api/users")
  .post(authCtrl.verifyCaptcha, userCtrl.create)
  .get(userCtrl.list)

router
  .route("/api/users/follow")
  .put(authCtrl.requireLogin, userCtrl.addFollowing, userCtrl.addFollower)
router
  .route("/api/users/unfollow")
  .put(authCtrl.requireLogin, userCtrl.removeFollowing, userCtrl.removeFollower)

router
  .route("/api/users/:userId")
  .get(userCtrl.read)
  .put(authCtrl.requireLogin, authCtrl.hasAuthorization, userCtrl.update)

router.route("/api/user/following").get(userCtrl.listFollowing)
router.route("/api/user/followers").get(userCtrl.listFollowers)

router.route("/api/user/avatar").get(userCtrl.avatar, userCtrl.defaultAvatar)
router.route("/api/user/avatar/default").get(userCtrl.defaultAvatar)

router.param("userId", userCtrl.userByID)

export default router
