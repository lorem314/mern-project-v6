import mongoose from "mongoose"

import Photo from "./photo.model"

const PostSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, required: "Text is required" },
    photos: [{ type: mongoose.Schema.ObjectId, ref: "Photo" }],
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
)

PostSchema.post("findOneAndDelete", function (post, next) {
  post.photos.forEach(async (photo) => {
    await Photo.findByIdAndDelete(photo._id)
  })
  next()
})

export default mongoose.model("Post", PostSchema)
