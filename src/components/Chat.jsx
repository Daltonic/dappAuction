import { useEffect, useState } from 'react'
import Identicon from 'react-identicons'
import { toast } from 'react-toastify'
import { getMessages, listenForMessage, sendMessage } from '../services/chat'
import { truncate, useGlobalState } from '../store'

const Chat = ({ id, group }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [connectedAccount] = useGlobalState('connectedAccount')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message) return
    await sendMessage(`pid_${id}`, message)
      .then(async (msg) => {
        setMessages((prevState) => [...prevState, msg])
        setMessage('')
        scrollToEnd()
      })
      .catch((error) => {
        toast.error('Encountered Error, check the console')
        console.log(error)
      })
  }

  useEffect(async () => {
    await getMessages(`pid_${id}`)
      .then((msgs) => {
        setMessages(msgs)
        scrollToEnd()
      })
      .catch((error) => console.log(error))

    await listenForMessage(`pid_${id}`)
      .then((msg) => {
        setMessages((prevState) => [...prevState, msg])
        scrollToEnd()
      })
      .catch((error) => console.log(error))
  }, [])

  const scrollToEnd = () => {
    const elmnt = document.getElementById('messages-container')
    elmnt.scrollTop = elmnt.scrollHeight
  }

  return (
    <div className='w-full'>
      <h2 className="mt-12 px-2 py-1 font-bold text-2xl italic text-white">NFT-World</h2>
      <h4 className="px-2 font-semibold text-xs text-white">Join the Live Chat</h4>
      <div
        className="bg-gray-800 bg-opacity-50 w-full
        rounded-md p-2 sm:p-8 mt-5 shadow-md shadow-[#25bd9c]"
      >
        <div
          id="messages-container"
          className="h-[calc(100vh_-_30rem)] overflow-y-auto"
        >
          {messages.map((msg, i) => (
            <Message
              isOwner={msg.sender.uid == connectedAccount}
              owner={msg.sender.uid}
              msg={msg.text}
              key={i}
            />
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-row justify-between items-center bg-gray-800 rounded-md"
        >
          <input
            className="block w-full text-sm resize-none
            text-slate-100 bg-transparent border-0
              focus:outline-none focus:ring-0 h-15 px-4 py-4"
            type="text"
            name="Leave a Message"
            placeholder={
              !group?.hasJoined
                ? 'Join group first to chat...'
                : 'Leave a Message...'
            }
            disabled={!group?.hasJoined}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" hidden>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

const Message = ({ msg, owner, isOwner }) => (
  <div>
    <div className="flex justify-start items-center space-x-1 mb-2">
      <Identicon
        string={owner}
        className="h-5 w-5 object-contain bg-gray-800 rounded-full"
        size={18}
      />
      <div className="space-x-1">
        <span className="text-[#25bd9c] font-bold">
          {isOwner ? '@You' : truncate(owner, 4, 4, 11)}
        </span>
        <span className="text-gray-200 text-xs">{msg}</span>
      </div>
    </div>
  </div>
)

export default Chat
