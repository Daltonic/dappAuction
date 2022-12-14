import Artworks from '../components/Artworks'
import Main from '../components/Main'
import { useGlobalState } from '../store'

const Home = () => {
  const [auctions] = useGlobalState('auctions')
  return (
    <div>
      <Main />
      {auctions.length > 0 ? <Artworks auctions={auctions} /> : null}
    </div>
  )
}

export default Home
