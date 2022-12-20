import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { buyNFTItem } from '../services/blockchain'
import { setGlobalState } from '../store'
import Countdown from './Countdown'

const Artworks = ({ auctions, title, showOffer }) => {
  return (
    <div className="w-4/5 py-10 mx-auto justify-center">
      <p className="text-xl uppercase text-white mb-4">
        {title ? title : 'Current Bids'}
      </p>
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
        md:gap-4 lg:gap-3 py-2.5 text-white font-mono px-1"
      >
        {auctions.map((auction, i) => (
          <Auction key={i} auction={auction} showOffer={showOffer} />
        ))}
      </div>
    </div>
  )
}

const Auction = ({ auction, showOffer }) => {
  const onOffer = () => {
    setGlobalState('auction', auction)
    setGlobalState('offerModal', 'scale-100')
  }

  const onPlaceBid = () => {
    setGlobalState('auction', auction)
    setGlobalState('bidBox', 'scale-100')
  }

  const onEdit = () => {
    setGlobalState('auction', auction)
    setGlobalState('priceModal', 'scale-100')
  }

  const handleNFTpurchase = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await buyNFTItem(auction)
          .then(() => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Processing...',
        success: 'Purchase successful, will reflect within 30sec 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  return (
    <div
      className="full overflow-hidden bg-gray-800 rounded-md shadow-xl 
    shadow-black md:w-6/4 md:mt-0 font-sans my-4"
    >
      <Link to={'/nft/' + auction.tokenId}>
        <img
          src={auction.image}
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
            {auction.live && auction.duration > Date.now() ? (
              <Countdown timestamp={auction.duration} />
            ) : (
              '00:00:00'
            )}
          </div>
        </div>
      </div>
      {showOffer ? (
        auction.live && Date.now() < auction.duration ? (
          <button
            className="bg-yellow-500 w-full h-[40px] p-2 text-center
            font-bold font-mono"
            onClick={onOffer}
          >
            Auction Live
          </button>
        ) : (
          <div className="flex justify-start">
            <button
              className="bg-red-500 w-full h-[40px] p-2 text-center
              font-bold font-mono"
              onClick={onOffer}
            >
              Offer
            </button>
            <button
              className="bg-orange-500 w-full h-[40px] p-2 text-center
              font-bold font-mono"
              onClick={onEdit}
            >
              Change
            </button>
          </div>
        )
      ) : auction.biddable ? (
        <button
          className="bg-green-500 w-full h-[40px] p-2 text-center
          font-bold font-mono"
          onClick={onPlaceBid}
          disabled={Date.now() > auction.duration}
        >
          Place a Bid
        </button>
      ) : (
        <button
          className="bg-red-500 w-full h-[40px] p-2 text-center
          font-bold font-mono"
          onClick={handleNFTpurchase}
          disabled={Date.now() > auction.duration}
        >
          Buy NFT
        </button>
      )}
    </div>
  )
}

export default Artworks
