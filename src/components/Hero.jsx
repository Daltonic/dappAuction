import { toast } from 'react-toastify'
import { BsArrowRightShort } from 'react-icons/bs'
import picture0 from '../assets/images/picture0.png'
import { setGlobalState, useGlobalState } from '../store'

const Hero = () => {
  return (
    <div className="flex flex-col items-start md:flex-row w-4/5 mx-auto mt-11">
      <Banner />
      <Bidder />
    </div>
  )
}

const Bidder = () => (
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

const Banner = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')

  const handleCreate = () => {
    if (!connectedAccount) {
      toast.warning('Connect your wallet first')
      return
    } else {
      setGlobalState('boxModal', 'scale-100')
    }
  }

  return (
    <div
      className="flex flex-col md:flex-row w-full justify-between 
        items-center mx-auto"
    >
      <div className="">
        <h1 className="text-white font-semibold text-5xl py-1">
          Discover, Collect
        </h1>
        <h1 className="font-semibold text-4xl mb-5 text-white py-1">
          and Sell
          <span className="text-green-500 px-1">NFTs</span>.
        </h1>
        <p className="text-white  font-light">
          More than 100+ NFT available for collect
        </p>
        <p className="text-white mb-11 font-light">& sell, get your NFT now.</p>
        <div className="flex flew-row text-5xl mb-4">
          <button
            className="text-white text-sm p-2 bg-green-500 rounded-sm w-auto 
            flex flex-row justify-center items-center shadow-md shadow-gray-700"
            onClick={handleCreate}
          >
            Create NFT
            <BsArrowRightShort className="font-bold animate-pulse" />
          </button>
        </div>
        <div className="flex items-center justify-between w-3/4 mt-5">
          <div>
            <p className="text-white font-bold">100k+</p>
            <small className="text-gray-300">Auction</small>
          </div>
          <div>
            <p className="text-white font-bold">210k+</p>
            <small className="text-gray-300">Rare</small>
          </div>
          <div>
            <p className="text-white font-bold">120k+</p>
            <small className="text-gray-300">Artist</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
