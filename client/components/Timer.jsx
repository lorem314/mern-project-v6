import { useState, useEffect, useMemo } from "react"

const Timer = ({
  duration = 60000,
  start = 60,
  end = 0,
  step = -1,
  isTiming = true,
  onTimeout = () => {},
  children = null,
}) => {
  const [hasTimeout, setHasTimeout] = useState(false)
  const [count, setCount] = useState(start)
  const delay = useMemo(
    () => Math.abs((duration * step) / (start - end)),
    [duration, step, start, end]
  )

  useEffect(() => {
    let tid
    if (isTiming) {
      tid = setInterval(() => {
        setCount((c) => {
          if (c > 0) return c + step
          console.log("setHasTimeout to true")
          setHasTimeout(true)
          clearInterval(tid)
          return c
        })
      }, delay)
    }
    return () => clearInterval(tid)
  }, [delay, isTiming, hasTimeout, step, onTimeout])

  useEffect(() => {
    if (hasTimeout) {
      onTimeout()
    }
  }, [hasTimeout, onTimeout])

  return typeof children === "function" ? children(count) : count
}

export default Timer
