import mongoose from "mongoose"

const PhotoSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Photo", PhotoSchema)
