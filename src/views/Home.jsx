import Artworks from '../components/Artworks'
import Empty from '../components/Empty'
import Main from '../components/Main'
import { useGlobalState } from '../store'

const Home = () => {
  const [auctions] = useGlobalState('auctions')
  return (
    <div>
      <Main />
      {auctions.length > 0 ? <Artworks auctions={auctions} /> : <Empty />}
    </div>
  )
}

export default Home
