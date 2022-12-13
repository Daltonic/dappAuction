const Minted = () => {
  return (
    <div className="w-4/5 py-10 mx-auto justify-center">
      <p className="text-xl uppercase text-white mb-4">Minted Tokens</p>
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
        md:gap-4 lg:gap-3 py-2.5 text-white font-mono px-1"
      >
        {Array(7)
          .fill()
          .map((auction, i) => (
            <Auction key={i} id={i} />
          ))}
      </div>
    </div>
  )
}

const Auction = ({ id }) => (
  <div
    className="full overflow-hidden bg-gray-800 rounded-md shadow-xl 
    shadow-black md:w-6/4 md:mt-0 font-sans my-4"
  >
    <img
      src={
        'https://cdn.pixabay.com/photo/2017/02/01/00/26/cranium-2028555_1280.png'
      }
      alt="nft"
      className="object-contain w-full h-60"
    />
    <div
      className="bg-green-500 w-full h-[40px] p-2 text-center
    font-bold font-mono "
    >
      Place Auction #{id}
    </div>
  </div>
)

export default Minted
