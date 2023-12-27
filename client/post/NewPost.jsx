import React from "react"
import styled from "styled-components"
import { useForm } from "react-hook-form"

import { create } from "./api-post"
import { useAuth } from "../auth/AuthContext"

const Wrapper = styled.div`
  > form {
    > .photos {
      display: flex;
      flex-wrap: wrap;
      > .photo {
        max-width: calc(100% / 3);
        aspect-ratio: 1/1;
        object-fit: cover;
      }
      > .upload-photos-button {
        width: calc(100% / 3);
        aspect-ratio: 1/1;
        display: inline-flex;
        flex-direction: column;
      }
    }
    > .actions {
      display: flex;
      justify-content: flex-end;
    }
  }
`

const NewPost = ({ addPost = () => {} }) => {
  const { jwt } = useAuth()
  const { register, handleSubmit, getValues, watch, setValue, reset } = useForm(
    {
      mode: "onChange",
      defaultValues: { photos: [] },
    }
  )
  watch("photos")

  const removePhotoByIndex = (index) => () => {
    const photos = getValues("photos")
    const newPhotos = Array.from(photos)
    newPhotos.splice(index, 1)
    console.log("removePhotoByIndex", newPhotos)
    setValue("photos", newPhotos)
  }

  const onSubmit = (data) => {
    const { text, photos } = data
    const trimmedText = text.trim()
    if (trimmedText.length === 0 && photos.length === 0) {
      console.log("photos 和 text 都为空")
    }
    const form = new FormData()
    trimmedText && form.append("text", trimmedText)
    Array.from(photos).forEach((photo) => form.append("photos[]", photo))
    create(form, { t: jwt?.token }).then((res) => {
      if (res.error) {
        console.error("[NewPost] create", res)
      } else {
        const { post } = res
        post.isLiked = false
        post.likeCount = 0
        post.commentCount = 0
        console.log("[NewPost] create", post)
        addPost(post)
        reset()
      }
    })
  }

  const photos = getValues("photos")
  return (
    <Wrapper>
      <h3>发布动态</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea className="resize-v" rows="4" {...register("text")} />

        <div className="photos">
          {Array.from(photos).map((photo, index) => {
            return (
              <img
                key={index}
                className="photo"
                src={URL.createObjectURL(photo)}
                title={photo.name}
                alt={photo.name}
                onClick={removePhotoByIndex(index)}
              />
            )
          })}
          <label className="upload-photos-button" htmlFor="upload-photos">
            <span>上传图片</span>
            <span style={{ fontSize: "2rem" }}>&#43;</span>
          </label>
          <input
            type="file"
            id="upload-photos"
            multiple={true}
            accept="image/*"
            {...register("photos")}
          />
        </div>

        <div className="actions">
          <button type="submit">发布</button>
        </div>
      </form>
    </Wrapper>
  )
}

export default NewPost
