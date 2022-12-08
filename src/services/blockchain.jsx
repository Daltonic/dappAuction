import auction from '../abis/src/contracts/Auction.sol/Auction.json'
import nft from '../abis/src/contracts/NFT.sol/NFT.json'
import addresses from '../abis/contractAddress.json'
import { getGlobalState, setGlobalState } from './store'
import { ethers } from 'ethers'

const { ethereum } = window
const auctionContractAddress = addresses.auction
const nftContractAddress = addresses.nft
const auctionContractAbi = auction.abi
const nftContractAbi = nft.abi

const getAuctionContract = () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      auctionContractAddress,
      auctionContractAbi,
      signer,
    )

    return contract
  } else {
    return getGlobalState('contract')
  }
}

const getNFTContract = () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      nftContractAddress,
      nftContractAbi,
      signer,
    )

    return contract
  } else {
    return getGlobalState('contract')
  }
}

const isWallectConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      await isWallectConnected()
      window.location.reload()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
      alert('Please connect wallet.')
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const reportError = (error) => {
  console.log(error.message)
  throw new Error('No ethereum object.')
}

export { isWallectConnected, connectWallet }
