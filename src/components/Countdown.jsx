import { useState, useEffect } from 'react'

const Countdown = ({ timestamp }) => {
  const [timeLeft, setTimeLeft] = useState(timestamp - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timestamp - Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [timestamp])

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return Date.now() > timestamp ? (
    '00:00:00'
  ) : (
    <div>
      {days}d : {hours}h : {minutes}m : {seconds}s
    </div>
  )
}

export default Countdown
