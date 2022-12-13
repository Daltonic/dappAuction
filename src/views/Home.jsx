import Artworks from '../components/Artworks'
import Main from '../components/Main'
import { useGlobalState } from '../store'

const Home = () => {
  const [auctions] = useGlobalState('auctions')
  return (
    <div>
      <Main />
      <Artworks auctions={auctions} />
    </div>
  )
}

export default Home
