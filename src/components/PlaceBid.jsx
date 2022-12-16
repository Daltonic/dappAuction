import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { bidOnNFT } from '../services/blockchain'
import { setGlobalState, useGlobalState } from '../store'

const PlaceBid = () => {
  const [auction] = useGlobalState('auction')
  const [bidBox] = useGlobalState('bidBox')
  const [price, setPrice] = useState('')

  const closeModal = () => {
    setGlobalState('bidBox', 'scale-0')
    setPrice('')
  }

  const handleBidPlacement = async (e) => {
    e.preventDefault()
    if (!price) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await bidOnNFT({ ...auction, price })
          .then(() => {
            resolve()
            closeModal()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Processing...',
        success: 'Bid placed successful, will reflect within 30sec 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 ${bidBox}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#25bd9c] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleBidPlacement} className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400 italic">
              {auction?.name}
            </p>
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                alt="NFT"
                className="h-full w-full object-cover cursor-pointer"
                src={auction?.image}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 px-4 py-2"
              type="number"
              name="price"
              step={0.01}
              min={0.01}
              placeholder="Price (Eth)"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <button
            type="submit"
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#25bd9c]
              py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#ffffff]
              hover:border hover:border-[#25bd9c]
              focus:outline-none focus:ring mt-5"
          >
            Place Bid
          </button>
        </form>
      </div>
    </div>
  )
}

export default PlaceBid
