import picture0 from '../assets/images/picture0.png'

const Bidder = () => {
  return (
    <div
      className="w-full text-white overflow-hidden bg-gray-800 rounded-md shadow-xl 
      shadow-black md:w-3/5 lg:w-2/5 md:mt-0 font-sans"
    >
      <img src={picture0} alt="nft" className="object-cover w-full h-60" />
      <div
        className="shadow-lg shadow-gray-400 border-4 border-[#ffffff36] 
        flex flex-row justify-between items-center px-3"
      >
        <div className="p-2">
          Current Bid
          <div className="font-bold text-center">2.231 ETH</div>
        </div>
        <div className="p-2">
          Auction End
          <div className="font-bold text-center">20:10</div>
        </div>
      </div>
      <div
        className="bg-green-500 w-full h-[40px] p-2 text-center 
      font-bold font-mono "
      >
        Place a Bid
      </div>
    </div>
  )
}

export default Bidder
