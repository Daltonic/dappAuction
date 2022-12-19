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
  const secs = 5
  const metadata1 =
    'https://ipfs.io/ipfs/QmY3p6rUBSyyCCg4Gp35aCX2HGPUSyR2EcnUTrsrhK4si4'
  const metadata2 =
    'https://ipfs.io/ipfs/QmcvMdhMduoV7pQYXAe5d8QenCstigRmLNqA8BFv18pc8q'
  const biddable = true
  const royaltyFee = 5

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('Auction')
    ;[seller, buyer, reseller, bidder] = await ethers.getSigners()

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

    it('Should confirm NFT Auction Price Change', async () => {
      result = await contract.getAuction(tokenId)
      expect(result.price).to.be.equal(price)

      await contract.changePrice(tokenId, newPrice)

      result = await contract.getAuction(tokenId)
      expect(result.price).to.be.equal(newPrice)
    })

    it('Should confirm NFT Auction Listing', async () => {
      result = await contract.getMyAuctions({ from: seller.address })
      expect(result).to.have.lengthOf(1)
    })

    it('Should confirm NFT Auction Purchase', async () => {
      result = await contract.getAuction(tokenId)
      expect(result.seller).to.be.equal(seller.address)
      expect(result.sold).to.be.equal(false)

      result = await contract.balanceOf(buyer.address)
      expect(result).to.equal(0)
      result = await contract.balanceOf(seller.address)
      expect(result).to.equal(1)

      await contract.offerAuction(tokenId, !biddable, secs, 0, 0, 0, {
        from: seller.address,
      })

      await contract.connect(buyer).buyAuctionedItem(tokenId, {
        value: price,
      })

      result = await contract.getAuction(tokenId)
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

      await contract
        .connect(reseller)
        .offerAuction(tokenId2, !biddable, secs, 0, 0, 0)
      await contract.connect(buyer).buyAuctionedItem(tokenId2, {
        value: price,
      })

      result = await contract.getUnsoldAuction()
      expect(result).to.have.lengthOf(1)
    })

    it('Should confirm Sold Auctioned NFTs', async () => {
      result = await contract.getUnsoldAuction()
      expect(result).to.have.lengthOf(2)

      await contract.offerAuction(tokenId, !biddable, secs, 0, 0, 0, {
        from: seller.address,
      })
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
      await contract.offerAuction(tokenId, !biddable, secs, 0, 0, 0, {
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
      await contract
        .connect(buyer)
        .offerAuction(tokenId, !biddable, secs, 0, 0, 0)
      // Status after offering
      result = await contract.getAuction(tokenId)
      expect(result.live).to.be.equal(true)
    })

    it('Should confirm NFT Auction Bidding and Claim', async () => {
      result = await contract.getAuction(tokenId)
      expect(result.sold).to.be.equal(false)
      expect(result.price).to.be.equal(price)

      result = await contract.balanceOf(buyer.address)
      expect(result).to.equal(0)
      result = await contract.balanceOf(bidder.address)
      expect(result).to.equal(0)

      await contract.offerAuction(tokenId, biddable, secs, 0, 0, 0, {
        from: seller.address,
      })

      await contract.connect(buyer).placeBid(tokenId, {
        value: price,
      })

      await contract.connect(bidder).placeBid(tokenId, {
        value: newPrice,
      })

      result = await contract.getBidders(tokenId)
      expect(result).to.have.lengthOf(2)

      result = await contract.getAuction(tokenId)
      expect(result.price).to.be.equal(newPrice)

      setTimeout(async () => {
        await contract.connect(bidder).claimPrize(tokenId, 1)

        result = await contract.getAuction(tokenId)
        expect(result.sold).to.be.equal(true)
        expect(result.owner).to.be.equal(bidder.address)

        result = await contract.balanceOf(buyer.address)
        expect(result).to.equal(0)
        result = await contract.balanceOf(bidder.address)
        expect(result).to.equal(1)
      }, secs * 1000)
    })
  })
})
