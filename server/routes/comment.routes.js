import express from "express"

import authCtrl from "../controllers/auth.controller"
import userCtrl from "../controllers/user.controller"
import commentCtrl from "../controllers/comment.controller"

const router = express.Router()

router
  .route("/api/comments")
  .post(
    authCtrl.requireLogin,
    commentCtrl.create,
    commentCtrl.pushToParentComments
  )

router.route("/api/comments/like").put(authCtrl.requireLogin, commentCtrl.like)
router
  .route("/api/comments/unlike")
  .put(authCtrl.requireLogin, commentCtrl.unlike)

router.route("/api/comments/:commentId/replies").get(commentCtrl.listReplies)

router
  .route("/api/comments/:commentId")
  .delete(
    authCtrl.requireLogin,
    commentCtrl.isCreator,
    commentCtrl.pullFromParentComments,
    commentCtrl.remove
  )

// router.param("userId", userCtrl.userByID)
router.param("commentId", commentCtrl.commentByID)

export default router
