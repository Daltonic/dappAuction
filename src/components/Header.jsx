import React from 'react'


const Header = () => {
  return (
  <nav className="w-4/5 flex flex-row md:justify-center justify-between items-center py-4 mx-auto">
    <div className="md:flex-[0.5] flex-initial justify-center items-center">
    <div  className="text-white">
          <button className="px-2 py-1 font-bold text-3xl italic">
            Dapp
          </button>
          <button className="py-1 font-semibold italic">
             Auction-NFT
          </button>
         </div>
    </div>

    <ul
      className="md:flex-[0.5] text-white md:flex
      hidden list-none flex-row justify-between 
      items-center flex-initial"
    >
      <li className="mx-4 cursor-pointer">Market</li>
      <li className="mx-4 cursor-pointer">Artist</li>
      <li className="mx-4 cursor-pointer">Features</li>
      <li className="mx-4 cursor-pointer">Community</li>
    </ul>

      <button
        className="shadow-xl shadow-black text-white
        bg-green-500 hover:bg-green-700 md:text-xs p-2
        rounded-full cursor-pointer text-xs sm:text-base"
      >
        Connect Wallet
      </button>
  </nav>
  )
}
export default Header