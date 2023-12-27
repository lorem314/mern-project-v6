import { networkInterfaces } from "os"
import mongoose from "mongoose"

import app from "./express"
import redisClient from "./redis-server"
import config from "../config/config"

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
})
mongoose.connection.on("error", (error) => {
  console.log("Error :", error)
  console.error(`[ERROR] 无法连接到 MongoDB: ${config.mongoUri}`)
  throw new Error(`[ERROR] 无法连接到 MongoDB: ${config.mongoUri}`)
})
mongoose.connection.on("connected", () => {
  console.info(`[>>>>] 成功连接到 MongoDB`)
})

redisClient.connect()

app.listen(config.port, function onStart(err) {
  if (err) {
    console.error(err)
  }
  const nets = networkInterfaces()
  const ip = nets["wlan0"][0].address
  console.log("")
  console.info(`[>>>>] 成功开启服务器`)
  console.info(`[>>>>] 本地 http://localhost:${config.port}`)
  console.info(`[>>>>] 网络 http://${ip}:${config.port}`)
})
