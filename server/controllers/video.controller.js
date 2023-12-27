import fs from "fs"
import extend from "lodash/extend"
import formidable from "formidable"
import mongoose from "mongoose"

import Video from "../models/video.model"
import User from "../models/user.model"

let gridfs = null
mongoose.connection.on("connected", () => {
  gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db)
})

const create = async (req, res) => {
  try {
    const form = formidable({ keepExtensions: true })
    const [fields, files] = await form.parse(req)

    const title = fields["title"][0]
    const tags = fields["tags"][0].split(" ")
    const description = fields["description"][0]
    const videoFile = files?.video[0]

    const video = new Video({ title, tags, description })

    if (videoFile) {
      const writeStream = gridfs.openUploadStream(video._id, {
        contentType: videoFile.mimetype || "binary/octet-stream",
      })
      fs.createReadStream(videoFile.filepath).pipe(writeStream)
    }

    video.createdBy = req.auth._id

    await video.save()
    await video.populate("createdBy", "name email")

    console.log("video", video)

    return res.json({
      video: {
        _id: video._id,
        title: video.title,
        tags: video.tags,
        description: video.description,
        views: video.views,
        createdAt: video.createdAt,
        createdBy: video.createdBy,
        likeCount: 0,
        commentCount: 0,
        isLiked: false,
      },
    })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法上传", errString: error.toString() })
  }
}

const listByUser = async (req, res) => {
  const { user } = req
  const { requesterId } = req.query
  try {
    const videos = await Video.aggregate([
      { $match: { createdBy: user._id } },
      {
        $project: {
          title: 1,
          tags: 1,
          description: 1,
          createdBy: 1,
          createdAt: 1,
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
          isLiked: { $in: [{ $toObjectId: requesterId }, "$likes"] },
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    await User.populate(videos, { path: "createdBy", select: "name email" })

    return res.json({
      videos,
      createdBy: { _id: user._id, email: user.email, name: user.name },
    })
  } catch (error) {
    return res.status(400).json({ error: "无法获取视频列表" })
  }
}

const videoByID = async (req, res, next, id) => {
  console.log("[videoByID] here")
  try {
    const video = await Video.findById(
      id,
      "title tags description createdAt createdBy views"
    )
      // .populate("createdBy", "name email")
      .exec()

    if (!video) return res.status(404).json({ error: "找不到该视频" })
    req.video = video

    const files = await gridfs.find({ filename: video._id }).toArray()

    if (!files[0]) return res.status(404).json({ error: "找不到该视频" })
    req.file = files[0]

    next()
  } catch (error) {
    console.error("[video.controller] videoByID", error.toString())
    return res.status(400).json({ error: error.toString() })
  }
}

const watch = async (req, res) => {
  const range = req.headers["range"]
  console.log("range", range)
  if (range && typeof range === "string") {
    const parts = range.replace(/bytes=/, "").split("-")
    const partialStart = parts[0]
    const partialEnd = parts[1]

    const start = parseInt(partialStart, 10)
    const end = partialEnd ? parseInt(partialEnd, 10) : req.file.length - 1
    const chunkSize = end - start + 1

    res.writeHead(206, {
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Range": `bytes ${start}-${end}/${req.file.length}`,
      "Content-Type": req.file.contentType,
    })

    const downloadStream = gridfs.openDownloadStream(req.file._id, {
      start,
      end: end + 1,
    })
    downloadStream.pipe(res)
    downloadStream.on("error", () => res.sendStatus(400))
    downloadStream.on("end", () => res.end())
  } else {
    res.header("Content-Length", req.file.length)
    res.header("Content-Type", req.file.contentType)

    const downloadStream = gridfs.openDownloadStream(req.file._id)
    downloadStream.pipe(res)
    downloadStream.on("error", () => res.sendStatus(400))
    downloadStream.on("end", () => res.end())
  }
}

const read = async (req, res) => {
  const videoId = req.video._id
  const { requesterId } = req.query
  try {
    const aggrCommentsOfVideo = await Video.aggregate([
      { $match: { _id: videoId } },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { "comments.createdAt": -1 } },
      {
        $lookup: {
          from: "users",
          localField: "comments.createdBy",
          foreignField: "_id",
          as: "comments.createdBy",
        },
      },
      { $unwind: "$comments.createdBy" },
      {
        $project: {
          _id: 1,
          comments: {
            _id: 1,
            text: 1,
            createdAt: 1,
            likeCount: { $size: "$comments.likes" },
            commentCount: { $size: "$comments.comments" },
            isLiked: {
              $in: [{ $toObjectId: requesterId }, "$comments.likes"],
            },
            createdBy: { _id: 1, name: 1, email: 1 },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          comments: { $push: "$comments" },
        },
      },
    ])

    const aggrVideo = await Video.aggregate([
      { $match: { _id: videoId } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $project: {
          // commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
          isLiked: { $in: [{ $toObjectId: requesterId }, "$likes"] },
          createdBy: { _id: 1, name: 1, email: 1 },
        },
      },
    ])
    console.log("aggrVideo", aggrVideo)
    const { likeCount, isLiked, createdBy } = aggrVideo[0]

    const { _id, title, tags, description, views, createdAt } = req.video
    return res.json({
      message: "OK",
      video: { _id, title, tags, description, createdBy, views, createdAt },
      likeCount,
      isLiked,
      comments: aggrCommentsOfVideo[0]?.comments || [],
    })
  } catch (error) {
    return res.status(400).json({ error: "无法获取视频信息" })
  }
}

const isPoster = (req, res, next) => {
  const posterId = req.video.createdBy
  const isPoster = req.video && req.auth && posterId == req.auth._id
  if (!isPoster) {
    return res
      .status(403)
      .json({ error: "[video.controller] isPoster 没有权限删除该动态" })
  }
  next()
}

const remove = async (req, res) => {
  const videoId = req.video._id
  try {
    await Video.findByIdAndDelete(videoId)
    return res.json({ removedVideoId: videoId })
  } catch (err) {
    return res.status(400).json({
      error: "[postCtrl.remove] 无法删除该动态",
      errMsg: err.toString(),
    })
  }
}

const like = async (req, res) => {
  const { videoId, userId } = req.body
  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $push: { likes: userId } },
      { new: true }
    )
    return res.json({ videoId: video._id })
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    })
  }
}

const unlike = async (req, res) => {
  const { videoId, userId } = req.body
  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $pull: { likes: userId } },
      { new: true }
    )
    return res.json({ videoId: video._id })
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    })
  }
}

const incrementViews = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(
      req.video._id,
      { $inc: { views: 1 } },
      { new: true }
    )
    next()
  } catch (error) {
    return res.status(400).json({ error: "无法增加视频的观看次数" })
  }
}

export default {
  create,
  listByUser,
  videoByID,
  watch,
  read,
  isPoster,
  remove,
  like,
  unlike,
  incrementViews,
}
