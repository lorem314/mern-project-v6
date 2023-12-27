import mongoose from "mongoose"

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: "视频标题不能为空" },
    description: String,
    tags: [String],
    views: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Video", VideoSchema)
