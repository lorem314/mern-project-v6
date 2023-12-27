import formidable from "formidable"
import fs from "fs"

import User from "../models/user.model"
import Post from "../models/post.model"
import Photo from "../models/photo.model"
import dbErrorHandler from "../helper/dbErrorHandler"

const create = async (req, res) => {
  const form = formidable({ keepExtensions: true, multiples: true })
  try {
    const [fields, files] = await form.parse(req)
    const post = new Post(
      Object.entries(fields).reduce(
        (obj, [key, value]) => ({ ...obj, [key]: value[0] }),
        {}
      )
    )
    post.createdBy = req.auth._id
    post.photos = []
    // search using async/await with a forEach loop
    // maybe consider useing for...of
    files["photos[]"]?.forEach((item) => {
      const photo = new Photo(item)
      photo.data = fs.readFileSync(item.filepath)
      photo.contentType = item.mimetype
      photo.save()
      post.photos.push(photo._id)
    })
    await post.save()
    await post.populate("createdBy", "name email")

    return res.json({
      post: {
        _id: post._id,
        text: post.text,
        photos: post.photos,
        createdAt: post.createdAt,
        createdBy: post.createdBy,
      },
      message: "成功创建动态",
    })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法创建动态", errString: error.toString() })
  }
}

const listByUser = async (req, res) => {
  const { user } = req
  const { requesterId } = req.query
  try {
    // const posts = await Post.find({ createdBy: user._id })
    //   .populate("createdBy", "name email")
    //   // .populate("photos", "data contentType")
    //   .sort("-createdAt")
    //   .exec()

    const posts = await Post.aggregate([
      { $match: { createdBy: user._id } },
      {
        $project: {
          text: 1,
          photos: 1,
          createdBy: 1,
          createdAt: 1,
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
          isLiked: { $in: [{ $toObjectId: requesterId }, "$likes"] },
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    await User.populate(posts, { path: "createdBy", select: "name email" })

    return res.json({ posts, createdBy: user })
  } catch (error) {
    return res.status(400).json({
      error: "无法获取该用户的动态",
      err: error.toString(),
    })
  }
}

const postByID = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id, "text photos createdAt")
      // .populate("createdBy", "_id name email")
      // .populate("likes", "_id name email")
      // .populate({
      //   path: "comments",
      //   options: { sort: { createdAt: -1 } },
      //   populate: { path: "createdBy", select: "_id name email" },
      // })
      .exec()
    if (!post) return res.status(400).json({ error: "找不到该动态" })

    req.post = post
    next()
  } catch (err) {
    return res
      .status(400)
      .json({ error: "无法获取该动态信息", err: err.toString() })
  }
}

const read = async (req, res) => {
  const { requesterId } = req.query
  console.log("[post.controller] read by user", requesterId)
  console.log("[post.controller] postId", req.post._id)
  try {
    const aggrCommentsOfPost = await Post.aggregate([
      { $match: { $expr: { $eq: [req.post._id, "$_id"] } } },
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
            isLiked: { $in: [{ $toObjectId: requesterId }, "$comments.likes"] },
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
    // console.log("[post.controller] aggrCommentsOfPost ------------------------")
    // console.log(aggrCommentsOfPost)

    const aggrPost = await Post.aggregate([
      { $match: { $expr: { $eq: [req.post._id, "$_id"] } } },
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
          likeCount: { $size: "$likes" },
          isLiked: { $in: [{ $toObjectId: requesterId }, "$likes"] },
          createdBy: { _id: 1, name: 1, email: 1 },
        },
      },
    ])
    // console.log("[post.controller] aggrPost[0] -------------------------------")
    // console.log(aggrPost[0])
    const { isLiked, createdBy, likeCount } = aggrPost[0]

    const { _id, text, photos, createdAt } = req.post
    return res.json({
      post: {
        _id,
        text,
        photos,
        createdAt,
        createdBy,
        likeCount,
        comments: aggrCommentsOfPost[0]?.comments || [],
      },
      isLiked,
    })
  } catch (err) {
    return res
      .status(400)
      .json({ error: "无法获取该动态信息", err: err.toString() })
  }
}

const isPoster = (req, res, next) => {
  const posterId = req.post.createdBy
  const isPoster = req.post && req.auth && posterId == req.auth._id
  if (!isPoster) {
    return res.status(403).json({ error: "[isPoster] 没有权限删除该动态" })
  }
  next()
}

const remove = async (req, res) => {
  const postId = req.post._id
  try {
    await Post.findByIdAndDelete(postId)
    res.json({ removedPostId: postId })
  } catch (err) {
    return res.status(400).json({
      error: "[postCtrl.remove] 无法删除该动态",
      errMsg: err.toString(),
    })
  }
}

const like = async (req, res) => {
  const { postId, userId } = req.body
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: userId } },
      { new: true }
    )
    return res.json({ postId: post._id })
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    })
  }
}
const unlike = async (req, res) => {
  const { postId, userId } = req.body
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    )
    return res.json({ postId: post._id })
  } catch (err) {
    return res.status(400).json({
      error: dbErrorHandler.getErrorMessage(err),
    })
  }
}

export default {
  create,
  listByUser,
  postByID,
  read,
  isPoster,
  remove,
  like,
  unlike,
}
