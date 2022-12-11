import Bidder from './Bidder'
import Hero from './Hero'


const Main = () => {
  return (
    <div className='flex flex-col items-start md:flex-row w-4/5 mx-auto mt-11'>
      <Hero/>
      <Bidder/>
    </div>
  )
}

export default Main