import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, required: "Text is required" },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
)

CommentSchema.post("findOneAndDelete", function (comment, next) {
  comment.comments.forEach(async (reply) => {
    await Comment.findByIdAndDelete(reply._id)
  })
  next()
})

const Comment = mongoose.model("Comment", CommentSchema)

export default Comment
