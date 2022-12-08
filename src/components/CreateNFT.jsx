import React from 'react'
import { BsPlayFill } from 'react-icons/bs'
import { BsArrowRightShort } from 'react-icons/bs'
import { setGlobalState} from "../store"


const CreateNFT = () => {

  return (
    <div
      className="flex flex-col md:flex-row w-full justify-between 
        items-center mx-auto"
    >
      <div className="">
        <h1 className="text-white font-semibold text-5xl py-1">Discover, Collect</h1>
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
            className="text-white text-sm px-2 bg-green-500 rounded-sm w-auto 
                    flex flex-row justify-center items-center shadow-md shadow-gray-700"
                    onClick={() => setGlobalState('boxModal', 'scale-100')}
           >
            Launch Art
            <BsArrowRightShort className="font-bold animate-pulse" />
          </button>
          <button
            className="text-white text-sm p-2 mx-5 flex flex-row 
                    justify-center items-center bg-[#ffffff36] rounded-sm w-auto"
          >
            <BsPlayFill className="animate-pulse" />
            <span className="px-2"> | </span>
            Learn More
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

export default CreateNFT
