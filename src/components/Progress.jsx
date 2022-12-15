import { useState, useEffect } from 'react'

const Progress = ({ timestamp }) => {
  const [timeLeft, setTimeLeft] = useState(timestamp - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timestamp - Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [timestamp])

  const totalTime = timestamp - Date.now()
  const percentage = (timeLeft / totalTime) * 100

  return (
    <div
      className={`h-[80%] w-[${percentage.toFixed(
        2,
      )}%] bg-green-500 flex justify-end
        items-center rounded-md pr-[2px]`}
    ></div>
  )
}

export default Progress
