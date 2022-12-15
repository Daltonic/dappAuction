import { setGlobalState, useGlobalState } from '../store'
import picture0 from '../assets/images/picture0.png'
import { Link } from 'react-router-dom'
import Countdown from './Countdown'

const Bidder = () => {
  const [auction] = useGlobalState('auction')

  const onPlaceBid = () => {
    setGlobalState('auction', auction)
    setGlobalState('bidBox', 'scale-100')
  }

  return (
    <div
      className="w-full text-white overflow-hidden bg-gray-800 rounded-md shadow-xl 
      shadow-black md:w-3/5 lg:w-2/5 md:mt-0 font-sans"
    >
      <Link to={'/nft/' + auction.tokenId}>
        <img
          src={auction.image || picture0}
          alt={auction.name}
          className="object-cover w-full h-60"
        />
      </Link>
      <div
        className="shadow-lg shadow-gray-400 border-4 border-[#ffffff36] 
      flex flex-row justify-between items-center text-gray-300 px-2"
      >
        <div className="flex flex-col items-start py-2 px-1">
          <span>Current Bid</span>
          <div className="font-bold text-center">{auction.price} ETH</div>
        </div>
        <div className="flex flex-col items-start py-2 px-1">
          <span>Auction End</span>
          <div className="font-bold text-center">
            {auction.duration > Date.now() ? (
              <Countdown timestamp={auction.duration} />
            ) : (
              '00:00:00'
            )}
          </div>
        </div>
      </div>
      <button
        className="bg-green-500 w-full h-[40px] p-2 text-center
        font-bold font-mono"
        onClick={onPlaceBid}
      >
        Place a Bid
      </button>
    </div>
  )
}

export default Bidder
