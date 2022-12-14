import Artworks from '../components/Artworks'
import { useGlobalState } from '../store'

const Collections = () => {
  const [collections] = useGlobalState('collections')
  return (
    <div>
      <Artworks title="Your Collections" auctions={collections} />
    </div>
  )
}

export default Collections
