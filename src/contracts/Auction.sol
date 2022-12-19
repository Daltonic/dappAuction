//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Auction is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private totalItems;

    address companyAcc;
    uint listingPrice = 0.02 ether;
    uint royalityFee;
    mapping(uint => AuctionStruct) auctionedItem;
    mapping(uint => bool) auctionedItemExist;
    mapping(string => uint) existingURIs;
    mapping(uint => BidderStruct[]) biddersOf;

    constructor(uint _royaltyFee) ERC721("Daltonic Tokens", "DAT") {
        companyAcc = msg.sender;
        royalityFee = _royaltyFee;
    }

    struct BidderStruct {
        address bidder;
        uint price;
        uint timestamp;
        bool refunded;
        bool won;
    }

    struct AuctionStruct {
        string name;
        string description;
        string image;
        uint tokenId;
        address seller;
        address owner;
        address winner;
        uint price;
        bool sold;
        bool live;
        bool biddable;
        uint bids;
        uint duration;
    }

    event AuctionItemCreated(
        uint indexed tokenId,
        address seller,
        address owner,
        uint price,
        bool sold
    );

    function getListingPrice() public view returns (uint) {
        return listingPrice;
    }

    function setListingPrice(uint _price) public {
        require(msg.sender == companyAcc, "Unauthorized entity");
        listingPrice = _price;
    }

    function changePrice(uint tokenId, uint price) public {
        require(
            auctionedItem[tokenId].owner == msg.sender,
            "Unauthorized entity"
        );
        require(
            getTimestamp(0, 0, 0, 0) > auctionedItem[tokenId].duration,
            "Auction still Live"
        );
        require(price > 0 ether, "Price must be greater than zero");

        auctionedItem[tokenId].price = price;
    }

    function mintToken(string memory tokenURI) internal returns (bool) {
        totalItems.increment();
        uint tokenId = totalItems.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return true;
    }

    function createAuction(
        string memory name,
        string memory description,
        string memory image,
        string memory tokenURI,
        uint price
    ) public payable nonReentrant {
        require(price > 0 ether, "Sales price must be greater than 0 ethers.");
        require(
            msg.value >= listingPrice,
            "Price must be up to the listing price."
        );
        require(mintToken(tokenURI), "Could not mint token");

        uint tokenId = totalItems.current();

        AuctionStruct memory item;
        item.tokenId = tokenId;
        item.name = name;
        item.description = description;
        item.image = image;
        item.price = price;
        item.duration = getTimestamp(0, 0, 0, 0);
        item.seller = msg.sender;
        item.owner = msg.sender;

        auctionedItem[tokenId] = item;
        auctionedItemExist[tokenId] = true;

        payTo(companyAcc, listingPrice);

        emit AuctionItemCreated(tokenId, msg.sender, address(0), price, false);
    }

    function offerAuction(
        uint tokenId,
        bool biddable,
        uint sec,
        uint min,
        uint hour,
        uint day
    ) public {
        require(
            auctionedItem[tokenId].owner == msg.sender,
            "Unauthorized entity"
        );
        require(
            auctionedItem[tokenId].bids == 0,
            "Winner should claim prize first"
        );

        if (!auctionedItem[tokenId].live) {
            setApprovalForAll(address(this), true);
            IERC721(address(this)).transferFrom(
                msg.sender,
                address(this),
                tokenId
            );
        }

        auctionedItem[tokenId].bids = 0;
        auctionedItem[tokenId].live = true;
        auctionedItem[tokenId].sold = false;
        auctionedItem[tokenId].biddable = biddable;
        auctionedItem[tokenId].duration = getTimestamp(sec, min, hour, day);
    }

    function placeBid(uint tokenId) public payable {
        require(
            msg.value >= auctionedItem[tokenId].price,
            "Insufficient Amount"
        );
        require(
            auctionedItem[tokenId].duration > getTimestamp(0, 0, 0, 0),
            "Auction not available"
        );
        require(auctionedItem[tokenId].biddable, "Auction only for bidding");

        BidderStruct memory bidder;
        bidder.bidder = msg.sender;
        bidder.price = msg.value;
        bidder.timestamp = getTimestamp(0, 0, 0, 0);

        biddersOf[tokenId].push(bidder);
        auctionedItem[tokenId].bids++;
        auctionedItem[tokenId].price = msg.value;
        auctionedItem[tokenId].winner = msg.sender;
    }

    function claimPrize(uint tokenId, uint bid) public {
        require(
            getTimestamp(0, 0, 0, 0) > auctionedItem[tokenId].duration,
            "Auction still Live"
        );
        require(
            auctionedItem[tokenId].winner == msg.sender,
            "You are not the winner"
        );

        biddersOf[tokenId][bid].won = true;
        uint price = auctionedItem[tokenId].price;
        address seller = auctionedItem[tokenId].seller;

        auctionedItem[tokenId].winner = address(0);
        auctionedItem[tokenId].live = false;
        auctionedItem[tokenId].sold = true;
        auctionedItem[tokenId].bids = 0;
        auctionedItem[tokenId].duration = getTimestamp(0, 0, 0, 0);

        uint royality = (price * royalityFee) / 100;
        payTo(auctionedItem[tokenId].owner, (price - royality));
        payTo(seller, royality);
        IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        auctionedItem[tokenId].owner = msg.sender;

        performRefund(tokenId);
    }

    function performRefund(uint tokenId) internal {
        for (uint i = 0; i < biddersOf[tokenId].length; i++) {
            if (biddersOf[tokenId][i].bidder != msg.sender) {
                biddersOf[tokenId][i].refunded = true;
                payTo(
                    biddersOf[tokenId][i].bidder,
                    biddersOf[tokenId][i].price
                );
            } else {
                biddersOf[tokenId][i].won = true;
            }
            biddersOf[tokenId][i].timestamp = getTimestamp(0, 0, 0, 0);
        }

        delete biddersOf[tokenId];
    }

    function buyAuctionedItem(uint tokenId) public payable nonReentrant {
        require(
            msg.value >= auctionedItem[tokenId].price,
            "Insufficient Amount"
        );
        require(
            auctionedItem[tokenId].duration > getTimestamp(0, 0, 0, 0),
            "Auction not available"
        );
        require(!auctionedItem[tokenId].biddable, "Auction only for purchase");

        address seller = auctionedItem[tokenId].seller;
        auctionedItem[tokenId].live = false;
        auctionedItem[tokenId].sold = true;
        auctionedItem[tokenId].bids = 0;
        auctionedItem[tokenId].duration = getTimestamp(0, 0, 0, 0);

        uint royality = (msg.value * royalityFee) / 100;
        payTo(auctionedItem[tokenId].owner, (msg.value - royality));
        payTo(seller, royality);
        IERC721(address(this)).transferFrom(
            address(this),
            msg.sender,
            auctionedItem[tokenId].tokenId
        );

        auctionedItem[tokenId].owner = msg.sender;
    }

    function getAuction(uint id) public view returns (AuctionStruct memory) {
        require(auctionedItemExist[id], "Auctioned Item not found");
        return auctionedItem[id];
    }

    function getAllAuctions()
        public
        view
        returns (AuctionStruct[] memory Auctions)
    {
        uint totalItemsCount = totalItems.current();
        Auctions = new AuctionStruct[](totalItemsCount);

        for (uint i = 0; i < totalItemsCount; i++) {
            Auctions[i] = auctionedItem[i + 1];
        }
    }

    function getUnsoldAuction()
        public
        view
        returns (AuctionStruct[] memory Auctions)
    {
        uint totalItemsCount = totalItems.current();
        uint totalSpace;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (!auctionedItem[i + 1].sold) {
                totalSpace++;
            }
        }

        Auctions = new AuctionStruct[](totalSpace);

        uint index;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (!auctionedItem[i + 1].sold) {
                Auctions[index] = auctionedItem[i + 1];
                index++;
            }
        }
    }

    function getMyAuctions()
        public
        view
        returns (AuctionStruct[] memory Auctions)
    {
        uint totalItemsCount = totalItems.current();
        uint totalSpace;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].owner == msg.sender) {
                totalSpace++;
            }
        }

        Auctions = new AuctionStruct[](totalSpace);

        uint index;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].owner == msg.sender) {
                Auctions[index] = auctionedItem[i + 1];
                index++;
            }
        }
    }

    function getSoldAuction()
        public
        view
        returns (AuctionStruct[] memory Auctions)
    {
        uint totalItemsCount = totalItems.current();
        uint totalSpace;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].sold) {
                totalSpace++;
            }
        }

        Auctions = new AuctionStruct[](totalSpace);

        uint index;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].sold) {
                Auctions[index] = auctionedItem[i + 1];
                index++;
            }
        }
    }

    function getLiveAuctions()
        public
        view
        returns (AuctionStruct[] memory Auctions)
    {
        uint totalItemsCount = totalItems.current();
        uint totalSpace;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].duration > getTimestamp(0, 0, 0, 0)) {
                totalSpace++;
            }
        }

        Auctions = new AuctionStruct[](totalSpace);

        uint index;
        for (uint i = 0; i < totalItemsCount; i++) {
            if (auctionedItem[i + 1].duration > getTimestamp(0, 0, 0, 0)) {
                Auctions[index] = auctionedItem[i + 1];
                index++;
            }
        }
    }

    function getBidders(uint tokenId)
        public
        view
        returns (BidderStruct[] memory)
    {
        return biddersOf[tokenId];
    }

    function getTimestamp(
        uint sec,
        uint min,
        uint hour,
        uint day
    ) internal view returns (uint) {
        return
            block.timestamp +
            (1 seconds * sec) +
            (1 minutes * min) +
            (1 hours * hour) +
            (1 days * day);
    }

    function payTo(address to, uint amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}
