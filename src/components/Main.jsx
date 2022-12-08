import Bidder from './Bidder'
import CreateNFT from './CreateNFT'


const Main = () => {
  return (
    <div className='flex flex-col items-start md:flex-row w-4/5 mx-auto mt-11'>
      <CreateNFT/>
      <Bidder/>
    </div>
  )
}

export default Main