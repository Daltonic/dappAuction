const { ethers } = require('hardhat')
const fs = require('fs')

async function main() {
  const royaltyFee = 5
  const Contract = await ethers.getContractFactory('Auction')
  const contract = await Contract.deploy(royaltyFee)

  await contract.deployed()

  const address = JSON.stringify({ address: contract.address }, null, 4)
  fs.writeFile('./src/abis/contractAddress.json', address, 'utf8', (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('Deployed contract address', contract.address)
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})