import { createGlobalState } from 'react-hooks-global-state'

const { getGlobalState, useGlobalState, setGlobalState } = createGlobalState({
  boxModal: 'scale-0',
  bidBox: 'scale-0',
  offerModal: 'scale-0',
  connectedAccount: '',
  collections: [],
  bidders: [],
  auctions: [],
  auction: null,
})

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars)
    let end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}

const countDown = (timestamp) => {
  const now = new Date().getTime()
  const distance = timestamp - now

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`
}

export { getGlobalState, useGlobalState, setGlobalState, truncate, countDown }
