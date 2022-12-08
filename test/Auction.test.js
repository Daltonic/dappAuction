const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe('Contracts', () => {
  let nft, auction, result
  const tokenId = 1
  const tokenId2 = 2
  const price = toWei(1.5)
  const newPrice = toWei(2)
  const period = Date.now() + 3600 * 1000 * 72
  const tokenURI =
    'https://ipfs.io/ipfs/QmTWbe9wDns7aqZQNCuWh5PqybGbBF91kngC5Zf8qmCoyg/1.json'
  const tokenURI2 =
    'https://ipfs.io/ipfs/QmTWbe9wDns7aqZQNCuWh5PqybGbBF91kngC5Zf8qmCoyg/2.json'

  beforeEach(async () => {
    const Auction = await ethers.getContractFactory('Auction')
    const NFT = await ethers.getContractFactory('NFT')
    ;[seller, buyer, reseller] = await ethers.getSigners()

    auction = await Auction.deploy()
    nft = await NFT.deploy(auction.address)
  })

  describe('Auction', () => {
    beforeEach(async () => {
      await nft.mintToken(tokenURI, {
        from: seller.address,
      })
      await nft.connect(reseller).mintToken(tokenURI2)
    })

    describe('NFT Minting', () => {
      it('Should confirm NFT minting', async () => {
        result = await nft.balanceOf(seller.address)
        expect(result).to.equal(1)

        result = await nft.balanceOf(reseller.address)
        expect(result).to.equal(1)
      })
    })

    describe('Auction', () => {
      beforeEach(async () => {
        await auction.createAuction(nft.address, tokenId, price, {
          from: seller.address,
          value: toWei(0.02),
        })
        await auction
          .connect(reseller)
          .createAuction(nft.address, tokenId2, price, {
            value: toWei(0.02),
          })
      })

      it('Should confirm NFT Auction Creation', async () => {
        result = await auction.getMyAuctions({ from: seller.address })
        expect(result).to.have.lengthOf(1)
      })

      it('Should confirm NFT Auction Purchase', async () => {
        result = await auction.getAuction(tokenId)
        expect(Number(result.duration)).to.be.lessThan(new Date().getTime())
        expect(result.seller).to.be.equal(seller.address)
        expect(result.sold).to.be.equal(false)

        await auction.offerAuction(tokenId, period, {
          from: seller.address,
        })

        await auction.connect(buyer).buyAuctionedItem(nft.address, tokenId, {
          value: price,
        })

        result = await auction.getAuction(tokenId)
        expect(Number(result.duration)).to.be.greaterThan(new Date().getTime())
        expect(result.owner).to.be.equal(buyer.address)
        expect(result.sold).to.be.equal(true)
      })

      it('Should confirm NFT Price Change', async () => {
        result = await auction.getAuction(tokenId)
        expect(result.price).to.be.equal(price)

        await auction.changePrice(tokenId, newPrice, { from: seller.address })

        result = await auction.getAuction(tokenId)
        expect(result.price).to.be.equal(newPrice)
      })

      it('Should confirm All Auctioned NFTs', async () => {
        result = await auction.getAllAuctions()
        expect(result).to.have.lengthOf(2)
      })

      it('Should confirm Unsold Auctioned NFTs', async () => {
        result = await auction.getUnsoldAuction()
        expect(result).to.have.lengthOf(2)

        await auction.connect(reseller).offerAuction(tokenId2, period)
        await auction.connect(buyer).buyAuctionedItem(nft.address, tokenId2, {
          value: price,
        })

        result = await auction.getUnsoldAuction()
        expect(result).to.have.lengthOf(1)
      })

      it('Should confirm Sold Auctioned NFTs', async () => {
        result = await auction.getUnsoldAuction()
        expect(result).to.have.lengthOf(2)

        await auction.offerAuction(tokenId, period, { from: seller.address })
        await auction.connect(buyer).buyAuctionedItem(nft.address, tokenId, {
          value: price,
        })

        result = await auction.getSoldAuction()
        expect(result).to.have.lengthOf(1)
      })
    })
  })
})
