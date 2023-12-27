import path from "path"
import express from "express"
import React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import { ServerStyleSheet, StyleSheetManager } from "styled-components"
// 3rd middleware
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import favicon from "serve-favicon"

import MainRouter from "../client/MainRouter"
import htmlIndex from "./templates/index.html"
// routes
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import photoRoutes from "./routes/photo.routes"
import postRoutes from "./routes/post.routes"
import commentRoutes from "./routes/comment.routes"
import videoRoutes from "./routes/video.routes"

// only in dev mode
import devBundle from "./devBundle.js"
// only in dev mode

const CURRENT_WORKING_DIR = process.cwd()

const app = express()
// only in dev mode
devBundle.compile(app)
// only in dev mode

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())
app.use(helmet())
app.use(cors())

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")))
app.use(favicon(path.join(CURRENT_WORKING_DIR, "public", "favicon.ico")))

app.use("/", authRoutes)
app.use("/", userRoutes)
app.use("/", postRoutes)
app.use("/", photoRoutes)
app.use("/", commentRoutes)
app.use("/", videoRoutes)

app.use("*", (req, res) => {
  const context = {}
  const sheet = new ServerStyleSheet()
  try {
    const markup = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <StaticRouter location={req.originalUrl} context={context}>
          <MainRouter />
        </StaticRouter>
      </StyleSheetManager>
    )
    if (context.url) return res.redirect(303, context.originalUrl)
    const styleTags = sheet.getStyleTags()
    return res.status(200).send(htmlIndex({ markup, styleTags }))
  } catch (error) {
    console.error("[express.js] use * :", error)
  } finally {
    sheet.seal()
  }
})

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message })
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message })
    console.log(err)
  }
})

export default app
