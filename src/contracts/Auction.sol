//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Auction is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private totalItems;
    Counters.Counter private totalSales;

    address companyAcc;
    uint listingPrice = 0.02 ether;

    constructor(){
        companyAcc = msg.sender;
    }

    struct AuctionStruct {
        uint id;
        address nftContract;
        uint tokenId;
        address seller;
        address owner;
        uint price;
        bool sold;
        uint duration;
    }

    event AuctionItemCreated (
        uint indexed id,
        address indexed nftContract,
        uint256 indexed tokenId,
        address  seller,
        address  owner,
        uint256 price,
        bool sold
    );

    mapping(uint => AuctionStruct) auctionedItem;
    mapping(uint => bool) auctionedItemExist;
    mapping(address => uint) auctionsOf;

    function getListingPrice() public view returns (uint) {
        return listingPrice;
    }

    function setListingPrice(uint _price) public {
        require(msg.sender == companyAcc, "Unauthorized entity");
        listingPrice = _price;
    }

    function changePrice(
        uint256 tokenId,
        uint256 price
    ) public {
        require(auctionedItem[tokenId].seller == msg.sender, "Unauthorized entity");
        require(!auctionedItem[tokenId].sold, "Item already offered on the market");
        require(price > 0 ether, "Price must be greater than zero");

        auctionedItem[tokenId].price = price;
    }

    function offerAuction(
        uint256 tokenId,
        uint256 period
    ) public {
        require(auctionedItem[tokenId].seller == msg.sender, "Unauthorized entity");
        require(!auctionedItem[tokenId].sold, "Item already offered on the market");
        require(period > 0, "Days must be greater than zero");

        auctionedItem[tokenId].duration = block.timestamp * period;
    }

    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0 ether, "Sales price must be greater than 0 ethers.");
        require(msg.value >= listingPrice, "Price must be up to the listing price.");

        totalItems.increment();
        uint id = totalItems.current();

        AuctionStruct memory item;
        item.id = id;
        item.nftContract = nftContract;
        item.tokenId = tokenId;
        item.price = price;
        item.seller = msg.sender;

        auctionedItem[id] = item;
        auctionedItemExist[id] = true;
        auctionsOf[msg.sender]++;

        payTo(companyAcc, listingPrice);
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit AuctionItemCreated(
            id,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function buyAuctionedItem(
        address nftContract,
        uint256 id
    ) public payable nonReentrant {
        require(msg.value >= auctionedItem[id].price, "Insufficient Amount");
        require(auctionedItem[id].duration > block.timestamp, "Auction not available");

        auctionedItem[id].owner = msg.sender;
        auctionedItem[id].sold = true;
        auctionsOf[msg.sender]++;
        auctionsOf[auctionedItem[id].seller]--;
        totalSales.increment();

        payTo(auctionedItem[id].seller, msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, auctionedItem[id].tokenId);
    }

    function getUnsoldAuction() public view returns (AuctionStruct[] memory Auctions) {
        uint unsoldItemCount = totalItems.current() - totalSales.current();
        Auctions = new AuctionStruct[](unsoldItemCount);

        for(uint i = 0; i < totalItems.current(); i++) {
            if(!auctionedItem[i+1].sold) {
                Auctions[i] = auctionedItem[i+1];
            }
        }
    }

    function getMyAuctions() public view returns (AuctionStruct[] memory Auctions) {
        uint totalItemsCount = totalItems.current();
        Auctions = new AuctionStruct[](auctionsOf[msg.sender]);

        for(uint i = 0; i < totalItemsCount; i++) {
            if(auctionedItem[i+1].seller == msg.sender) {
                Auctions[i] = auctionedItem[i+1];
            }
        }
    }
    
    function getSoldAuction() public view returns (AuctionStruct[] memory Auctions) {
        uint soldItemCount = totalSales.current();
        Auctions = new AuctionStruct[](soldItemCount);

        for(uint i = 0; i < totalItems.current(); i++) {
            if(auctionedItem[i+1].sold) {
                Auctions[i] = auctionedItem[i+1];
            }
        }
    }
    
    function getAllAuctions() public view returns (AuctionStruct[] memory Auctions) {
        uint totalItemsCount = totalItems.current();
        Auctions = new AuctionStruct[](totalItemsCount);

        for(uint i = 0; i < totalItemsCount; i++) {
            Auctions[i] = auctionedItem[i+1];
        }
    }

    function getOfferedAuctions() public view returns (AuctionStruct[] memory Auctions) {
        uint totalItemsCount = totalItems.current();
        Auctions = new AuctionStruct[](totalItemsCount);

        for(uint i = 0; i < totalItemsCount; i++) {
            if(auctionedItem[i+1].duration > block.timestamp) {
                Auctions[i] = auctionedItem[i+1];
            }
        }
    }
    
    function getAuction(uint id) public view returns (AuctionStruct memory) {
        require(auctionedItemExist[id], "Auctioned Item not found");
        return auctionedItem[id];
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}