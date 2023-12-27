import React from "react"
import styled from "styled-components"

const Wrapper = styled.li`
  > img {
    /* max-width: calc(100% / 3); */
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: contain;
    object-fit: cover;
  }
`

const PhotoItem = ({ photoId }) => {
  return (
    <Wrapper>
      <img src={`/api/photos/${photoId}`} alt="无法获取图片" />
    </Wrapper>
  )
}

export default React.memo(PhotoItem)
