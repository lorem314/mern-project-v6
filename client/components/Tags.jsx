import React from "react"
import styled from "styled-components"

const Wrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;

  > li {
    border: 1px solid grey;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }
`

const Tags = ({ tags = [] }) => {
  return (
    <Wrapper className="no-style">
      {tags.map((tag, index) => {
        return <li key={index}>{tag}</li>
      })}
    </Wrapper>
  )
}

export default Tags
