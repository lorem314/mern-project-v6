import React, { useRef, useState } from "react"
import styled from "styled-components"
import ReactPlayer from "react-player"

const Wrapper = styled.div`
  margin: 1rem 0;
`

const VideoPlayer = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [duration, setDuration] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [isLoop, setIsLoop] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState(null)
  const [values, setValues] = useState({ played: 0, loaded: 0, isEnd: false })

  const playerRef = useRef(null)

  const handleError = (error) => {}

  const url = `/api/videos/watch/${videoId}`
  return (
    <Wrapper>
      <ReactPlayer
        url={url}
        controls={true}
        onError={(error) => {
          console.error(error)
        }}
      />
    </Wrapper>
  )
}

export default VideoPlayer
