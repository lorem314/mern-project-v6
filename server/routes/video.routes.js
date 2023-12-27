import express from "express"

import authCtrl from "../controllers/auth.controller"
import userCtrl from "../controllers/user.controller"
import videoCtrl from "../controllers/video.controller"

const router = express.Router()

router.route("/api/videos").post(authCtrl.requireLogin, videoCtrl.create)

router.route("/api/videos/by/:userId").get(videoCtrl.listByUser)

router.route("/api/videos/watch/:videoId").get(videoCtrl.watch)

router.route("/api/videos/like").put(authCtrl.requireLogin, videoCtrl.like)
router.route("/api/videos/unlike").put(authCtrl.requireLogin, videoCtrl.unlike)

router
  .route("/api/videos/:videoId")
  .get(videoCtrl.incrementViews, videoCtrl.read)
  .delete(authCtrl.requireLogin, videoCtrl.isPoster, videoCtrl.remove)

router.param("userId", userCtrl.userByID)
router.param("videoId", videoCtrl.videoByID)

export default router
