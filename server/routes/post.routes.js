import express from "express"

import authCtrl from "../controllers/auth.controller"
import userCtrl from "../controllers/user.controller"
import postCtrl from "../controllers/post.controller"

const router = express.Router()

router.route("/api/posts").post(authCtrl.requireLogin, postCtrl.create)

router.route("/api/posts/by/:userId").get(postCtrl.listByUser)

router.route("/api/posts/like").put(authCtrl.requireLogin, postCtrl.like)
router.route("/api/posts/unlike").put(authCtrl.requireLogin, postCtrl.unlike)

router
  .route("/api/posts/:postId")
  .get(postCtrl.read)
  .delete(authCtrl.requireLogin, postCtrl.isPoster, postCtrl.remove)

router.param("userId", userCtrl.userByID)
router.param("postId", postCtrl.postByID)

export default router
