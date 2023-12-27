import Photo from "../models/photo.model"

const photoByID = async (req, res, next, id) => {
  try {
    const photo = await Photo.findById(id)
      .select("data contentType createdAt")
      .exec()
    if (!photo) return res.status("400").json({ error: "找不到该图片" })
    req.photo = photo
    next()
  } catch (err) {
    return res.status(400).json({ error: "无法获取图片信息" })
  }
}

const read = (req, res) => {
  res.set("Content-Type", req.photo.contentType)
  return res.send(req.photo.data)
}

export default {
  photoByID,
  read,
}
