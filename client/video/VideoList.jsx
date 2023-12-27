import React from "react"
import styled from "styled-components"

import VideoItem from "./VideoItem"

const Wrapper = styled.ul`
  --border-color: lightgrey;
  > li {
    border: 1px solid var(--border-color);
    border-bottom: none;
  }
  > li:last-child {
    border-bottom: 1px solid var(--border-color);
  }
`

const VideoList = ({ videos = [], isMyself, removeVideoById = () => {} }) => {
  return (
    <Wrapper className="no-style">
      {videos.map((video) => {
        return (
          <VideoItem
            key={video._id}
            video={video}
            isMyself={isMyself}
            removeVideoById={removeVideoById}
          />
        )
      })}
    </Wrapper>
  )
}

export default VideoList
