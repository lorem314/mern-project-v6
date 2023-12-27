import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import ReactPlayer from "react-player"

import Tags from "../components/Tags"
import LikeButton from "./LikeButton"
import DeleteButton from "./DeleteButton"

const Wrapper = styled.li`
  padding: 0 1rem 1rem;
  > .video-thumbnail {
    margin: 0.5rem 1rem;
  }
  > .video-tags {
    margin: 0.5rem 0;
  }
  > .video-description {
    margin: 0.5rem 0;
  }
`

const VideoItem = ({ video, isMyself, removeVideoById = () => {} }) => {
  const cbAfterDelete = () => {
    removeVideoById(video._id)
  }
  return (
    <Wrapper>
      <h4>
        <Link to={`/videos/${video._id}`}>{video.title}</Link>
      </h4>
      <div className="video-thumbnail">
        <ReactPlayer
          url={`/api/videos/watch/${video._id}`}
          width="100%"
          height="inherit"
          style={{ maxHeight: "100%" }}
        />
      </div>
      <div className="video-tags">
        <Tags tags={video.tags} />
      </div>
      <div className="video-description">简介：{video.description}</div>
      <div className="actions flex">
        <Link to={`/videos/${video._id}`}>评论({video.commentCount})</Link>
        <LikeButton
          videoId={video._id}
          isLiked={video.isLiked}
          likeCount={video.likeCount}
        />
        {isMyself ? (
          <DeleteButton videoId={video._id} cbAfterDelete={cbAfterDelete} />
        ) : null}
      </div>
    </Wrapper>
  )
}

export default VideoItem
