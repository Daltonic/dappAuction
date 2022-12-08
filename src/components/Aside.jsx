import React from 'react'
import picture5 from '../assets/images/picture5.png'
import picture2 from '../assets/images/picture2.png'
import picture3 from '../assets/images/picture3.jpg'
import picture4 from '../assets/images/picture4.png'

const Aside = () => {
  return (
    <div className="w-4/5 py-10 mx-auto justify-center">
      <p className="text-xl uppercase text-white mb-4">Current Bids</p>
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
                     md:gap-4 lg:gap-3 py-2.5 text-white font-mono px-1"
      >
        <div
          className="full overflow-hidden bg-gray-800 rounded-md shadow-xl 
                                   shadow-black md:w-6/4 md:mt-0 font-sans"
        >
          <img
            src={picture5}
            alt="nft"
            className="object-cover w-full h-60 mt-5"
          />
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
          <div className="bg-green-500 w-full h-[40px] p-2 text-center font-bold font-mono ">
            Place a Bid
          </div>
        </div>

        <div
          className="full overflow-hidden bg-gray-800 rounded-md shadow-xl 
                                   shadow-black md:w-6/4 md:mt-0 font-sans"
        >
          <img
            src={picture2}
            alt="nft"
            className="object-cover w-full h-60 mt-5"
          />
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
          <div className="bg-green-500 w-full h-[40px] p-2 text-center font-bold font-mono ">
            Place a Bid
          </div>
        </div>

        <div
          className="full overflow-hidden bg-gray-800 rounded-md shadow-xl 
                                   shadow-black md:w-6/4 md:mt-0 font-sans"
        >
          <img
            src={picture4}
            alt="nft"
            className="object-cover w-full h-60 mt-5"
          />
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
          <div className="bg-green-500 w-full h-[40px] p-2 text-center font-bold font-mono">
            Place a Bid
          </div>
        </div>
        <div
          className="full overflow-hidden bg-gray-800 rounded-md shadow-xl 
                                   shadow-black md:w-6/4 md:mt-0 font-sans"
        >
          <img
            src={picture3}
            alt="nft"
            className="object-cover w-full h-60 mt-5"
          />
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
          <div className="bg-green-500 w-full h-[40px] p-2 text-center font-bold font-mono ">
            Place a Bid
          </div>
        </div>
      </div>
    </div>
  )
}

export default Aside
