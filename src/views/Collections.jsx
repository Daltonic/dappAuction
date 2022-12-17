import { useEffect } from 'react'
import { useGlobalState } from '../store'
import Artworks from '../components/Artworks'
import { loadCollections } from '../services/blockchain'
import Empty from '../components/Empty'

const Collections = () => {
  const [collections] = useGlobalState('collections')
  useEffect(async () => {
    await loadCollections()
  })
  return (
    <div>
      {collections.length > 0 ? (
        <Artworks title="Your Collections" auctions={collections} showOffer />
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default Collections
