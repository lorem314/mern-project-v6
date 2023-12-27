import React from "react"
import styled from "styled-components"
import { useForm } from "react-hook-form"

import { create } from "./api-video"
import { useAuth } from "../auth/AuthContext"

const Wrapper = styled.section`
  > form {
    margin: 0 2rem;
    > .video-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      > .buttons {
        display: flex;
        justify-content: space-around;
      }
    }
    > .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
  }
`

const NewVideo = ({ addVideo = () => {} }) => {
  const { jwt } = useAuth()
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: { video: null, title: "", tags: "", description: "" },
  })
  watch("video")

  const resetVideo = () => reset({ video: null })

  const onSubmit = (data) => {
    console.log("[NewVideo] create", data)
    const { title, tags, description, video } = data
    const trimmedTitle = title.trim()
    const trimmedTags = tags.trim().replace(/\s+/g, " ")
    const trimmedDescription = description.trim()

    const form = new FormData()
    trimmedTitle && form.append("title", trimmedTitle)
    trimmedTitle && form.append("tags", trimmedTags)
    trimmedDescription && form.append("description", trimmedDescription)
    video && form.append("video", video[0])

    create(form, { t: jwt.token }).then((res) => {
      if (res.error) {
        console.error("[NewVideo] create", res)
      } else {
        const { video } = res
        console.log("[NewVideo] create", video)
        addVideo(video)
        reset()
      }
    })
  }

  const valueOfVideo = getValues("video")
  const video = valueOfVideo ? valueOfVideo[0] : null

  return (
    <Wrapper>
      <h3>上传视频</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*  */}

        <div className="video-section">
          {video ? (
            <div className="uploaded-video">
              <div className="video-preview">
                <video src={URL.createObjectURL(video)} />
              </div>
              <div className="video-info">
                <div>标题 : {video.name}</div>
                <div>大小 : {video.size}</div>
              </div>
            </div>
          ) : null}
          <div className="buttons">
            <label className="button" htmlFor="video">
              上传视频
            </label>
            <input
              type="file"
              name="video"
              id="video"
              accept="video/*"
              {...register("video")}
            />
            {video ? (
              <button type="button" onClick={resetVideo}>
                取消
              </button>
            ) : null}
          </div>
        </div>

        <div className="label-input-group">
          <label htmlFor="">标题</label>
          <input type="text" {...register("title", { required: true })} />
        </div>

        <div className="label-input-group">
          <label htmlFor="">标签</label>
          <input type="text" {...register("tags")} />
        </div>

        <div className="label-input-group">
          <label htmlFor="">简介</label>
          <textarea name="" id="" rows="2" {...register("description")} />
        </div>

        <div className="actions">
          <button type="submit">上传</button>
        </div>
      </form>
    </Wrapper>
  )
}

export default NewVideo
