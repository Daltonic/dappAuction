import Nft from './views/Nft'
import Home from './views/Home'
import { useEffect } from 'react'
import Tokens from './views/Tokens'
import Header from './components/Header'
import Footer from './components/Footer'
import CreateNFT from './components/CreateNFT'
import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'
import { isWallectConnected, loadAuctions } from './services/blockchain'

function App() {
  useEffect(async () => {
    await isWallectConnected()
    await loadAuctions()
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
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/nft/:id" element={<Nft />} />
      </Routes>
      <CreateNFT />
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
