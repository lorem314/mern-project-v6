import fs from "fs"
import formidable from "formidable"
import extend from "lodash/extend"

import User from "../models/user.model"
import Post from "../models/post.model"
import Video from "../models/video.model"

import userDefaultAvatar from "../../assets/images/user-default-avatar.png"
import errorHandler from "../helper/dbErrorHandler"

const create = async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()

    return res.status(200).json({ message: "成功注册帐号" })
  } catch (error) {
    return res.status(400).json({
      error:
        (error.code === 11000 || error.code === 11001) && error.keyPattern.email
          ? "邮箱已被注册"
          : errorHandler.getErrorMessage(error),
    })
  }
}

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id, "name email about").exec()
    if (!user) return res.status("404").json({ error: "找不到该用户" })
    req.user = user
    next()
  } catch (err) {
    return res.status(400).json({ error: "无法获取用户信息" })
  }
}

const read = async (req, res) => {
  const { demanderId } = req.query || ""
  const { user } = req

  try {
    const aggrUser = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $project: {
          followingCount: { $size: "$following" },
          followersCount: { $size: "$followers" },
          isFollowing: { $in: [{ $toObjectId: demanderId }, "$followers"] },
        },
      },
    ]).exec()
    const { followingCount, followersCount, isFollowing } = aggrUser[0]

    const aggrPost = await Post.aggregate([
      { $match: { createdBy: user._id } },
      { $count: "postCount" },
    ])
    const postCount = aggrPost[0]?.postCount || 0

    const aggrVideo = await Video.aggregate([
      { $match: { createdBy: user._id } },
      { $count: "videoCount" },
    ])
    const videoCount = aggrVideo[0]?.videoCount || 0

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        about: user.about,
      },
      isFollowing,
      followingCount,
      followersCount,
      postCount,
      videoCount,
    })
  } catch (error) {
    return res.status(400).json({ error: error.toString() })
  }
}

const avatar = async (req, res, next) => {
  const { userId } = req.query
  if (!userId) return next()

  try {
    const user = await User.findById(userId, "_id avatar").exec()
    if (!user.avatar.contentType) return next()

    res.set("Content-Type", user.avatar.contentType)
    return res.send(user.avatar.data)
  } catch (error) {
    return res.sendFile(process.cwd() + userDefaultAvatar)
  }
}

const defaultAvatar = async (_req, res) => {
  return res.sendFile(process.cwd() + userDefaultAvatar)
}

const update = async (req, res) => {
  const form = formidable({ keepExtensions: true, multiples: false })
  try {
    const [fields, files] = await form.parse(req)
    const user = extend(
      req.user,
      Object.entries(fields).reduce(
        (obj, [key, value]) => ({ ...obj, [key]: value[0] }),
        {}
      )
    )

    if (files.avatar) {
      const avatarFile = files.avatar[0]
      user.avatar.data = fs.readFileSync(avatarFile.filepath)
      user.avatar.contentType = avatarFile.mimetype
    }

    const updatedUser = await user.save()
    const { _id, name, email } = updatedUser

    return res.json({ user: { _id, name, email } })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法更新用户信息", errString: error.toString() })
  }
}

const list = async (req, res) => {
  try {
    const users = await User.find({}, "name email about").exec()
    return res.json({ users })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const addFollowing = async (req, res, next) => {
  const { userId, followId } = req.body
  try {
    await User.findByIdAndUpdate(userId, { $push: { following: followId } })
    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    })
  }
}

const addFollower = async (req, res) => {
  const { userId, followId } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      followId,
      { $push: { followers: userId } },
      { new: true }
    )
    const followersCount = user.followers.length
    const isFollowing = user.followers.includes(userId)
    return res.json({ followersCount, isFollowing })
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    })
  }
}

const removeFollowing = async (req, res, next) => {
  const { userId, unfollowId } = req.body
  try {
    await User.findByIdAndUpdate(userId, { $pull: { following: unfollowId } })
    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    })
  }
}

const removeFollower = async (req, res) => {
  const { userId, unfollowId } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      unfollowId,
      { $pull: { followers: userId } },
      { new: true }
    )
    const followersCount = user.followers.length
    const isFollowing = user.followers.includes(userId)
    return res.json({ followersCount, isFollowing })
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    })
  }
}

const listFollowing = async (req, res) => {
  const { userId } = req.query
  try {
    const user = await User.findById(userId, "name")
      .populate("following", "name email")
      .exec()
    return res.json({ user })
  } catch (error) {
    return res.status(400).json({
      error: "无法获取粉丝信息",
    })
  }
}

const listFollowers = async (req, res) => {
  const { userId } = req.query
  try {
    const user = await User.findById(userId, "name")
      .populate("followers", "name email")
      .exec()
    return res.json({ user })
  } catch (error) {
    return res.status(400).json({
      error: "无法获取粉丝信息",
    })
  }
}

export default {
  create,
  userByID,
  read,
  avatar,
  defaultAvatar,
  update,
  list,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  listFollowing,
  listFollowers,
}
