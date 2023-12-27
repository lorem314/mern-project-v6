import { createGlobalStyle } from "styled-components"

const styled = { createGlobalStyle }

const GlobalStyle = styled.createGlobalStyle`
  :root {
  }

  * {
    box-sizing: border-box;
  }
  html {
    font-size: 16px;
  }
  body {
    margin: 0;
    background-color: #ddd;
  }

  a {
    text-underline-offset: 0.25rem;
  }

  button {
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;

    display: flex;
    justify-content: center;
    align-items: center;

    word-break: keep-all;

    &[disabled] {
      cursor: not-allowed;
    }
  }
  img {
    display: block;
  }
  input {
    padding: 0.25rem;
    line-height: 1.5;

    &[type="text"],
    &[type="email"],
    &[type="password"] {
      width: 100%;
    }

    &[type="checkbox"] {
      margin: 0.25rem;
      width: 1.25em;
      height: 1.25em;
      cursor: pointer;
    }

    &[type="file"] {
      display: none;
    }

    &[disabled] {
      cursor: not-allowed;
    }
  }
  label {
    user-select: none;
    display: inline-flex;
    word-break: keep-all;

    &[class$="button"] {
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem 0.5rem;
      margin: 0;
      line-height: normal;

      justify-content: center;
      align-items: center;

      border-radius: 0.25rem;
      border: 2px outset rgb(118, 118, 118);
      border-image: none 100% 1 0 stretch;
      background-color: rgb(239, 239, 239);
      &:hover {
        background-color: rgba(0, 0, 0, 0.15);
      }
      &:active {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
  ol {
    &.no-style {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
  }
  select {
    padding: 0.25rem;
  }
  textarea {
    width: 100%;
    padding: 0.25rem;
    line-height: 1.5;

    &.resize-v {
      resize: vertical;
    }
  }
  ul {
    &.no-style {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
  }
  video {
    width: 100%;
  }

  /* custom className */
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .inline-flex {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
  }
  .input-button-group {
    display: flex;
    gap: 0.25rem;

    > input {
      flex: 1 1 auto;
    }

    > button {
      flex: 1 0 auto;
    }
  }
  .label-input-group {
    margin: 0.5rem 0;

    > label {
      display: block;
      margin: 0.25rem 0;
    }

    > input {
    }
  }
  .route-page {
    background-color: white;
    max-width: 32rem;
    margin: 2rem auto;
    border: 1px solid transparent;
    padding: 0 1.5rem;
  }
`

export default GlobalStyle
