import Identicon from 'react-identicons'

const Chat = ({ id, group }) => {
  return (
    <div>
      <h2 className="mt-12 px-2 py-1 font-bold text-2xl italic">NFT-World</h2>
      <h4 className="px-2 font-semibold text-xs">Join the Live Chat</h4>
      <div
        className="bg-gray-800 bg-opacity-50 w-6/8 
        rounded-md p-2 sm:p-8 mt-5 shadow-md shadow-[#25bd9c] sm:w-[200%]"
      >
        <div className="h-[calc(100vh_-_30rem)] overflow-y-auto">
          {Array(6)
            .fill()
            .map((msg, i) => (
              <Message msg={i} key={i} />
            ))}
        </div>

        <div className="flex flex-row justify-between items-center bg-gray-800 rounded-md">
          <textarea
            className="block w-full text-sm resize-none
            text-slate-100 bg-transparent border-0
              focus:outline-none focus:ring-0 h-15 px-4 py-2"
            type="text"
            name="Leave a Message"
            placeholder={
              !group?.hasJoined
                ? 'Join group first to chat...'
                : 'Leave a Message'
            }
            disabled={!group?.hasJoined}
          ></textarea>
        </div>
      </div>
    </div>
  )
}

const Message = ({ msg }) => (
  <div>
    <div className="flex justify-start items-start space-x-2 mb-5">
      <Identicon
        string={'jsdskjhesdilhm'}
        className="h-5 w-5 object-contain bg-gray-800 rounded-full"
        size={18}
      />
      <div className="flex flex-col">
        <span className="text-[#25bd9c] font-bold">Vince-Nft</span>
        <span className="text-gray-200 text-xs w-7/12">
          check the radiant in acimbo and resize the texture pf the element the
          texture pf the element the texture pf the element.
        </span>
      </div>
    </div>
  </div>
)

export default Chat
