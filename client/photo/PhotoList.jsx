import React from "react"
import styled from "styled-components"

import PhotoItem from "./PhotoItem"

const Wrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;

  > li {
    width: calc(100% / ${({ columns }) => columns});
  }
`

const PhotoList = ({ photos = [], maxColumns = 3 }) => {
  const columns = photos.length >= maxColumns ? maxColumns : photos.length
  return (
    <Wrapper className="no-style" columns={columns}>
      {photos.map((photoId) => {
        return <PhotoItem key={photoId} photoId={photoId} />
      })}
    </Wrapper>
  )
}

export default PhotoList
