import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"

import { useAuth } from "../auth/AuthContext"
import { read } from "./api-video"
import NewComment from "../comment/NewComment"
import CommentList from "../comment/CommentList"
import Tags from "../components/Tags"
import VideoPlayer from "./VideoPlayer"
import { getDateTime } from "../utils/date"
import UserInfo from "../user/UserInfo"
import LikeButton from "./LikeButton"
import DeleteButton from "./DeleteButton"

const Wrapper = styled.div`
  max-width: 64rem;
  margin: 2rem auto;

  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;

  > .video-info {
    padding: 0 1rem;
    background-color: white;
    grid-column-start: 1;
    grid-column-end: 2;
    > .video-description {
      padding: 0 1rem;
    }
    > .actions {
      display: flex;
      justify-content: space-around;
    }
  }
  > .video-comments {
    padding: 0 1rem 1rem;
    background-color: white;
    grid-row-start: 2;
    grid-row-end: 3;
  }
  > .related-videos {
    background-color: white;
  }
`

const Video = () => {
  const { jwt } = useAuth()
  const { videoId } = useParams()
  const navigate = useNavigate()
  const [state, setState] = useState({ video: null, comments: null })

  // read
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ videoId, requesterId: jwt?.user._id }, signal).then((res) => {
      if (res.error) {
        console.error("[Video] read", res)
      } else {
        console.log(res.message)
        console.log(res.video)
        const { video, likeCount, isLiked, comments } = res
        setState((prevState) => ({
          ...prevState,
          video,
          likeCount,
          isLiked,
          comments,
        }))
      }
    })
  }, [])

  const addComment = (comment) => {
    setState((prevState) => ({
      ...prevState,
      comments: [comment, ...prevState.comments],
    }))
  }

  const removeCommentById = (id) => {
    setState((prevState) => ({
      ...prevState,
      comments: prevState.comments.filter((comment) => comment._id !== id),
    }))
  }

  const cbAfterDelete = () => {
    navigate(`/videos/by/${jwt?.user._id}`)
  }

  const { video, likeCount, isLiked, comments } = state
  const isMyself = jwt?.user._id == video?.createdBy._id
  return video ? (
    <Wrapper>
      <section className="video-info">
        <h2>{video.title}</h2>
        <Tags tags={video.tags} />
        <VideoPlayer videoId={video._id} />

        <div className="actions">
          <LikeButton
            videoId={video._id}
            isLiked={isLiked}
            likeCount={likeCount}
          />
          {isMyself ? (
            <DeleteButton videoId={video._id} cbAfterDelete={cbAfterDelete} />
          ) : null}
        </div>

        <UserInfo user={video.createdBy} />
        <p className="video-description">{video.description}</p>
        <p>
          上传时间 : {getDateTime(video.createdAt)} - 播放次数 : {video.views}
        </p>
      </section>

      <section className="video-comments">
        <NewComment
          parentModelName="Video"
          parentObjectId={video._id}
          addComment={addComment}
        />

        <CommentList
          parentModelName="Video"
          parentObjectId={video._id}
          comments={comments}
          removeCommentById={removeCommentById}
        />
      </section>

      <section className="related-videos">related-videos</section>
    </Wrapper>
  ) : null
}

export default Video
