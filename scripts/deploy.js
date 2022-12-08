const { ethers } = require('hardhat')
const fs = require('fs')

async function main() {
  const Auction = await ethers.getContractFactory('Auction')
  const NFT = await ethers.getContractFactory('NFT')
  const auction = await Auction.deploy()
  const nft = await NFT.deploy(auction.address)

  const address = JSON.stringify(
    {
      auction: auction.address,
      nft: nft.address,
    },
    null,
    4,
  )

  fs.writeFile('./src/abis/contractAddress.json', address, 'utf8', (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Deployed contract address', address)
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
