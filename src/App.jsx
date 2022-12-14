import Nft from './views/Nft'
import Home from './views/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import { useEffect, useState } from 'react'
import PlaceBid from './components/PlaceBid'
import Collections from './views/Collections'
import CreateNFT from './components/CreateNFT'
import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'
import { isWallectConnected, loadAuctions } from './services/blockchain'
import { useGlobalState } from './store'

function App() {
  const [loaded, setLoaded] = useState(false)
  const [auction] = useGlobalState('auction')
  useEffect(async () => {
    await isWallectConnected()
    await loadAuctions()
    console.log('Blockchain Loaded')
    setLoaded(true)
  }, [])

  return (
    <div
      className="min-h-screen bg-gradient-to-t from-gray-800 bg-repeat
    via-[#25bd9c] to-gray-900 bg-center subpixel-antialiased"
    >
      <Header />
      {loaded ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/nft/:id" element={<Nft />} />
        </Routes>
      ) : null}
      <CreateNFT />
      {auction ? <PlaceBid /> : null}
      <Footer />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}
export default App
