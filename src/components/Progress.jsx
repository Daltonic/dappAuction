import { useState, useEffect } from 'react'

const Progress = ({ timestamp }) => {
  const [percentage, setPercentage] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timestamp - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timestamp - Date.now())
      const totalTime = timestamp - Date.now()
      setPercentage((timeLeft / totalTime) * 100)
      // console.log(percentage);
    }, 1000)

    return () => clearInterval(interval)
  }, [timestamp])

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
