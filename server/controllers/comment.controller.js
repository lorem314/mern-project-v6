import Comment from "../models/comment.model"
import Post from "../models/post.model"
import Video from "../models/video.model"

const modelNameMapper = { Comment, Post, Video }

const create = async (req, res, next) => {
  try {
    const comment = new Comment(req.body.comment)
    comment.createdBy = req.auth._id
    await comment.save()
    req.comment = comment
    next()
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法创建评论", errorString: error.toString() })
  }
}

const pushToParentComments = async (req, res) => {
  const { parentModelName, parentObjectId } = req.body
  const parentModel = modelNameMapper[parentModelName]
  const { comment } = req
  try {
    await parentModel.findByIdAndUpdate(
      parentObjectId,
      { $push: { comments: comment._id } },
      { new: true }
    )
    await comment.populate("createdBy", "name email")
    return res.json({
      comment: {
        _id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        createdBy: comment.createdBy,
        isLiked: false,
        likeCount: 0,
        commentCount: 0,
      },
      message: "OK",
    })
  } catch (error) {
    return res.status(400).json({
      error: "无法将评论添加到其父文档的 comments 中",
      errorString: error.toString(),
    })
  }
}

const listReplies = async (req, res) => {
  console.log("comment ", req.comment)
  const { requesterId } = req.query
  try {
    const aggrRepliesOfComment = await Comment.aggregate([
      { $match: { $expr: { $eq: [req.comment._id, "$_id"] } } },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      { $unwind: "$comments" },
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
    console.log("aggrRepliesOfComment", aggrRepliesOfComment[0].comments)
    const replies = aggrRepliesOfComment[0].comments
    return res.json({ message: "OK", replies })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法获取该评论的回复", err: error.toString() })
  }
}

const commentByID = async (req, res, next, id) => {
  try {
    const comment = await Comment.findById(id, "text createdBy").exec()
    if (!comment) return res.status(400).json({ error: "找不到该评论" })
    req.comment = comment
    next()
  } catch (error) {
    return res.status(400).json({ error: "无法获取该评论信息" })
  }
}

const isCreator = async (req, res, next) => {
  console.log("req.comment.createdBy", req.comment.createdBy)
  const isCreator =
    req.comment && req.auth && req.comment.createdBy._id == req.auth._id
  if (!isCreator) {
    return res.status(403).json({ error: "没有权限删除该评论" })
  }
  next()
}

const pullFromParentComments = async (req, res, next) => {
  const { parentModelName, parentObjectId } = req.body
  const parentModel = modelNameMapper[parentModelName]
  console.log("[comment.controller] pullFromParentComments")
  console.log("parentModelName ", parentModelName)
  console.log("parentObjectId ", parentObjectId)
  try {
    await parentModel.findByIdAndUpdate(
      parentObjectId,
      { $pull: { comments: req.comment._id } },
      { new: true }
    )
    next()
  } catch (error) {
    return res.status(400).json({ error: error.toString() })
  }
}

const remove = async (req, res) => {
  const commentId = req.comment._id
  try {
    console.log("[comment.controller] remove", commentId)
    await Comment.findByIdAndDelete(commentId)
    return res.json({ removedCommentId: commentId })
  } catch (error) {
    return res.status(400).json({ error: error.toString() })
  }
}

const like = async (req, res) => {
  const userId = req.auth._id
  const { commentId } = req.body
  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { likes: userId } },
      { new: true }
    )
    return res.json({ commentId: comment._id })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法点赞", errString: error.toString() })
  }
}

const unlike = async (req, res) => {
  const userId = req.auth._id
  const { commentId } = req.body
  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $pull: { likes: userId } },
      { new: true }
    )
    return res.json({ commentId: comment._id })
  } catch (error) {
    return res
      .status(400)
      .json({ error: "无法取消点赞", errString: error.toString() })
  }
}

export default {
  create,
  pushToParentComments,
  commentByID,
  isCreator,
  pullFromParentComments,
  remove,
  like,
  unlike,
  listReplies,
}
