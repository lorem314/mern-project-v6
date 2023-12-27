import React from "react"
import { Routes, Route } from "react-router-dom"

import GlobalStyle from "./GlobalStyle"
// core
import Home from "./core/Home"
import Menu from "./core/Menu"
// auth
import Login from "./auth/Login"
import Private from "./auth/Private"
import AuthContextProvider from "./auth/AuthContext"
// user
import Signup from "./user/Signup"
import User from "./user/User"
import EditUser from "./user/EditUser"
import Users from "./user/Users"
import Followers from "./user/Followers"
import Following from "./user/Following"
// post
import PostsBy from "./post/PostsBy"
import Post from "./post/Post"
//
import VideosBy from "./video/VideosBy"
import Video from "./video/Video"

const MainRouter = () => {
  return (
    <AuthContextProvider>
      <GlobalStyle />
      <Menu />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/users">
          <Route index element={<Users />} />
          <Route path=":userId">
            <Route index element={<User />} />
            <Route path="edit" element={<Private children={<EditUser />} />} />
            <Route path="followers" element={<Followers />} />
            <Route path="following" element={<Following />} />
          </Route>
        </Route>

        <Route path="/posts">
          <Route path="by">
            <Route path=":userId" element={<PostsBy />} />
          </Route>
          <Route path=":postId" element={<Post />} />
        </Route>

        <Route path="/videos">
          <Route path="by">
            <Route path=":userId" element={<VideosBy />} />
          </Route>
          <Route path=":videoId" element={<Video />} />
        </Route>

        {/*  */}
      </Routes>
    </AuthContextProvider>
  )
}

export default MainRouter
