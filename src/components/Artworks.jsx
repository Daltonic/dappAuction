import { Link } from 'react-router-dom'

const Artworks = ({ auctions }) => {
  return (
    <div className="w-4/5 py-10 mx-auto justify-center">
      <p className="text-xl uppercase text-white mb-4">Current Bids</p>
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
        md:gap-4 lg:gap-3 py-2.5 text-white font-mono px-1"
      >
        {auctions.map((auction, i) => (
          <Auction key={i} auction={auction} />
        ))}
      </div>
    </div>
  )
}

const Auction = ({ auction }) => (
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
      flex flex-row justify-between items-center text-gray-300 px-3"
    >
      <div className="p-2">
        Current Bid
        <div className="font-bold text-center">{auction.price} ETH</div>
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

export default Artworks
