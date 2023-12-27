import express from "express"

import photoCtrl from "../controllers/photo.controller"

const router = express.Router()

router.route("/api/photos/:photoId").get(photoCtrl.read)

router.param("photoId", photoCtrl.photoByID)

export default router
