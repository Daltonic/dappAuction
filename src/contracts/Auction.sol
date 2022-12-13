//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Auction is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private totalItems;
    Counters.Counter private liveActions;

    address companyAcc;
    uint listingPrice = 0.02 ether;
    uint royalityFee;

    constructor(uint _royaltyFee) ERC721("Daltonic Tokens", "DAT"){
        companyAcc = msg.sender;
        royalityFee = _royaltyFee;
    }

    struct TokenStruct {
        uint tokenId;
        address owner;
        bool sold;
    }

    struct AuctionStruct {
        string name;
        string description;
        string image;
        uint tokenId;
        address seller;
        address owner;
        uint price;
        bool sold;
        bool live;
        uint duration;
    }

    event AuctionItemCreated (
        uint indexed tokenId,
        address  seller,
        address  owner,
        uint price,
        bool sold
    );

    mapping(uint => AuctionStruct) auctionedItem;
    mapping(uint => bool) auctionedItemExist;
    mapping(string => uint) existingURIs;
    mapping(address => uint) auctionsOf;

    function getListingPrice() public view returns (uint) {
        return listingPrice;
    }

    function setListingPrice(uint _price) public {
        require(msg.sender == companyAcc, "Unauthorized entity");
        listingPrice = _price;
    }

    function changePrice(
        uint tokenId,
        uint price
    ) public {
        require(auctionedItem[tokenId].seller == msg.sender, "Unauthorized entity");
        require(!auctionedItem[tokenId].sold, "Item already offered on the market");
        require(!auctionedItem[tokenId].live, "Item is live on the market");
        require(price > 0 ether, "Price must be greater than zero");

        auctionedItem[tokenId].price = price;
    }

    function mintToken(string memory tokenURI) internal returns (bool) {
        totalItems.increment();
        uint newItemId = totalItems.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return true;
    }

    function offerAuction(
        uint tokenId,
        uint period
    ) public {
        require(auctionedItem[tokenId].owner == msg.sender, "Unauthorized entity");
        require(!auctionedItem[tokenId].live, "Item is live on the market");
        require(period > 0, "Days must be greater than zero");
        
        auctionedItem[tokenId].live = true;
        auctionedItem[tokenId].sold = false;
        auctionedItem[tokenId].duration = block.timestamp * period;
        setApprovalForAll(address(this), true);
        IERC721(address(this)).transferFrom(msg.sender, address(this), tokenId);
    }

    function createAuction(
        string memory name,
        string memory description,
        string memory image,
        string memory tokenURI,
        uint price
    ) public payable nonReentrant {
        require(price > 0 ether, "Sales price must be greater than 0 ethers.");
        require(msg.value >= listingPrice, "Price must be up to the listing price.");
        require(mintToken(tokenURI), "Could not mint token");

        uint tokenId = totalItems.current();

        AuctionStruct memory item;
        item.tokenId = tokenId;
        item.name = name;
        item.description = description;
        item.image = image;
        item.price = price;
        item.seller = msg.sender;
        item.owner = msg.sender;

        auctionedItem[tokenId] = item;
        auctionedItemExist[tokenId] = true;
        auctionsOf[msg.sender]++;

        payTo(companyAcc, listingPrice);

        emit AuctionItemCreated(
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function buyAuctionedItem(uint tokenId) public payable nonReentrant {
        require(msg.value >= auctionedItem[tokenId].price, "Insufficient Amount");
        require(auctionedItem[tokenId].duration > block.timestamp, "Auction not available");

        address seller = auctionedItem[tokenId].seller;
        auctionedItem[tokenId].owner = msg.sender;
        auctionedItem[tokenId].live = false;
        auctionedItem[tokenId].sold = true;
        auctionsOf[msg.sender]++;
        auctionsOf[seller]--;
        liveActions.increment();

        uint256 royality = (msg.value * royalityFee) / 100;
        payTo(seller, (msg.value - royality));
        payTo(seller, royality);
        IERC721(address(this)).transferFrom(address(this), msg.sender, auctionedItem[tokenId].tokenId);
    }

    function getUnsoldAuction() public view returns (AuctionStruct[] memory Auctions) {
        uint unsoldItemCount = totalItems.current() - liveActions.current();
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
        uint soldItemCount = liveActions.current();
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

    function payTo(address to, uint amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}