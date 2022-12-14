import { useEffect } from 'react'
import { useGlobalState } from '../store'
import Artworks from '../components/Artworks'
import { loadCollections } from '../services/blockchain'

const Collections = () => {
  const [collections] = useGlobalState('collections')
  useEffect(async () => {
    await loadCollections()
  })
  return (
    <div>
      <Artworks
        title="Your Collections"
        auctions={collections}
        showOffer
      />
    </div>
  )
}

export default Collections
