import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { offerItemOnMarket } from '../services/blockchain'
import { setGlobalState, useGlobalState } from '../store'

const OfferItem = () => {
  const [auction] = useGlobalState('auction')
  const [offerModal] = useGlobalState('offerModal')
  const [days, setDays] = useState('')
  const [biddable, setBiddable] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!days || !biddable) return
    const params = {
      days,
      biddable: biddable == 'true',
    }
    
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await offerItemOnMarket({ ...auction, ...params })
          .then(async () => {
            closeModal()
            resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Processing...',
        success: 'Offered on Market, will reflect within 30sec 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  const closeModal = () => {
    setGlobalState('offerModal', 'scale-0')
    setDays('')
    setBiddable('')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 ${offerModal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#25bd9c] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
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
              name="days"
              min={1}
              placeholder="Days E.g 7"
              onChange={(e) => setDays(e.target.value)}
              value={days}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <select
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0 px-4 py-2"
              name="biddable"
              onChange={(e) => setBiddable(e.target.value)}
              value={biddable}
              required
            >
              <option value="" hidden>
                Select Biddability
              </option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
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
            Offer Item
          </button>
        </form>
      </div>
    </div>
  )
}

export default OfferItem
