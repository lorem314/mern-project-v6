import React from "react"
import styled from "styled-components"

const Wrapper = styled.section`
  background-color: white;
  max-width: 32rem;
  margin: 2rem auto;
  border: 1px solid transparent;
  padding: 0 1.5rem;
`

const Home = () => {
  return (
    <Wrapper>
      <h2>主页</h2>
    </Wrapper>
  )
}

export default Home
