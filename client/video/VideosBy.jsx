import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"

import NewVideo from "./NewVideo"
import { useAuth } from "../auth/AuthContext"
import { listByUser } from "./api-video"
import VideoList from "./VideoList"

const Wrapper = styled.section`
  padding-bottom: 1rem;
`

const VideosBy = () => {
  const { userId } = useParams()
  const { jwt } = useAuth()
  const [state, setState] = useState({
    videos: [],
    createdBy: {},
  })

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByUser({ userId, requesterId: jwt?.user._id }, signal).then((res) => {
      if (res.error) {
        console.error("[VideosBy] listByUser", res)
      } else {
        const { videos, createdBy } = res
        setState((prevState) => ({
          ...prevState,
          videos,
          createdBy,
        }))
      }
    })
  }, [userId])

  const addVideo = (video) => {
    setState((prevState) => ({
      ...prevState,
      videos: [video, ...prevState.videos],
    }))
  }
  const removeVideoById = (id) => {
    setState((prevState) => ({
      ...prevState,
      videos: prevState.videos.filter((video) => video._id !== id),
    }))
  }

  const isMyself = jwt?.user._id == userId
  const { videos, createdBy } = state
  return createdBy._id ? (
    <Wrapper className="route-page">
      <h2>{isMyself ? "我的" : `用户 ${createdBy.name} 的`}视频</h2>

      {isMyself ? <NewVideo addVideo={addVideo} /> : null}

      <h3>视频列表({videos.length})</h3>
      <VideoList
        videos={videos}
        isMyself={isMyself}
        removeVideoById={removeVideoById}
      />
    </Wrapper>
  ) : null
}

export default VideosBy
