import { Route, Routes } from 'react-router-dom'
import Home from './views/Home'
import Nft from './views/Nft'
import Header from './components/Header'
import Footer from './components/Footer'
import CreateNFT from './components/CreateNFT'
import { useEffect } from 'react'
import { isWallectConnected } from './services/blockchain'

function App() {
  useEffect(async () => {
    await isWallectConnected()
    console.log('Blockchain Loaded')
  }, [])

  return (
    <div
      className="min-h-screen bg-gradient-to-t from-gray-800 bg-repeat
    via-[#25bd9c] to-gray-900 bg-center subpixel-antialiased"
    >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nft/:id" element={<Nft />} />
      </Routes>
      <CreateNFT />
      <Footer />
    </div>
  )
}
export default App
