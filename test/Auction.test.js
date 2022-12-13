const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe('Contracts', () => {
  let contract, result
  const tokenId = 1
  const tokenId2 = 2
  const name = 'Graduate Ape'
  const description = 'Lorem Ipsum Dalum Espaniol'
  const image =
    'https://ipfs.io/ipfs/QmY3p6rUBSyyCCg4Gp35aCX2HGPUSyR2EcnUTrsrhK4si4'
  const price = toWei(1.5)
  const newPrice = toWei(2)
  const period = Date.now() + 3600 * 1000 * 72
  const metadata1 =
    'https://ipfs.io/ipfs/QmY3p6rUBSyyCCg4Gp35aCX2HGPUSyR2EcnUTrsrhK4si4'
  const metadata2 =
    'https://ipfs.io/ipfs/QmcvMdhMduoV7pQYXAe5d8QenCstigRmLNqA8BFv18pc8q'
  const royaltyFee = 5

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('Auction')
    ;[seller, buyer, reseller] = await ethers.getSigners()

    contract = await Contract.deploy(royaltyFee)
    await contract.deployed()
  })

  describe('Auction', () => {
    beforeEach(async () => {
      await contract.createAuction(name, description, image, metadata1, price, {
        from: seller.address,
        value: toWei(0.02),
      })
      await contract
        .connect(reseller)
        .createAuction(name, description, image, metadata2, price, {
          value: toWei(0.02),
        })
    })

    it('Should confirm NFT Auction Creation', async () => {
      result = await contract.getMyAuctions({ from: seller.address })
      expect(result).to.have.lengthOf(1)
    })

    it('Should confirm NFT Auction Purchase', async () => {
      result = await contract.getAuction(tokenId)
      expect(Number(result.duration)).to.be.lessThan(new Date().getTime())
      expect(result.seller).to.be.equal(seller.address)
      expect(result.sold).to.be.equal(false)

      result = await contract.balanceOf(buyer.address)
      expect(result).to.equal(0)
      result = await contract.balanceOf(seller.address)
      expect(result).to.equal(1)

      await contract.offerAuction(tokenId, period, {
        from: seller.address,
      })

      await contract.connect(buyer).buyAuctionedItem(tokenId, {
        value: price,
      })

      result = await contract.getAuction(tokenId)
      expect(Number(result.duration)).to.be.greaterThan(new Date().getTime())
      expect(result.owner).to.be.equal(buyer.address)
      expect(result.sold).to.be.equal(true)

      result = await contract.balanceOf(buyer.address)
      expect(result).to.equal(1)
      result = await contract.balanceOf(seller.address)
      expect(result).to.equal(0)
    })

    it('Should confirm NFT Price Change', async () => {
      result = await contract.getAuction(tokenId)
      expect(result.price).to.be.equal(price)

      await contract.changePrice(tokenId, newPrice, { from: seller.address })

      result = await contract.getAuction(tokenId)
      expect(result.price).to.be.equal(newPrice)
    })

    it('Should confirm All Auctioned NFTs', async () => {
      result = await contract.getAllAuctions()
      expect(result).to.have.lengthOf(2)
    })

    it('Should confirm Unsold Auctioned NFTs', async () => {
      result = await contract.getUnsoldAuction()
      expect(result).to.have.lengthOf(2)

      await contract.connect(reseller).offerAuction(tokenId2, period)
      await contract.connect(buyer).buyAuctionedItem(tokenId2, {
        value: price,
      })

      result = await contract.getUnsoldAuction()
      expect(result).to.have.lengthOf(1)
    })

    it('Should confirm Sold Auctioned NFTs', async () => {
      result = await contract.getUnsoldAuction()
      expect(result).to.have.lengthOf(2)

      await contract.offerAuction(tokenId, period, { from: seller.address })
      await contract.connect(buyer).buyAuctionedItem(tokenId, {
        value: price,
      })

      result = await contract.getSoldAuction()
      expect(result).to.have.lengthOf(1)
    })

    it('Should confirm NFT Auction Relisting', async () => {
      // Status before offering
      result = await contract.getAuction(tokenId)
      expect(result.live).to.be.equal(false)
      // Seller offers NFT on market
      await contract.offerAuction(tokenId, period, {
        from: seller.address,
      })
      // Status after offering
      result = await contract.getAuction(tokenId)
      expect(result.live).to.be.equal(true)
      // Buyer purchases offered NFT
      await contract.connect(buyer).buyAuctionedItem(tokenId, {
        value: price,
      })
      // Status before purchase
      result = await contract.getAuction(tokenId)
      expect(result.live).to.be.equal(false)
      // Buyer offers NFT
      await contract.connect(buyer).offerAuction(tokenId, period)
      // Status after offering
      result = await contract.getAuction(tokenId)
      expect(result.live).to.be.equal(true)
    })
  })
})
