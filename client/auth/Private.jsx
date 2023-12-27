import React, { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router"

import { useAuth } from "./AuthContext"

const Private = ({ children = null, redirectPath = "/login" }) => {
  const { jwt } = useAuth()

  console.log("[Private] jwt", jwt)
  return jwt ? children : <Navigate to={redirectPath} />
}

export default Private
