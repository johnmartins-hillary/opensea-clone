//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; //prevents re-entrancy attacks
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner; //ownerr of the smart contract
    uint256 listingPrice = 0.025 ether; ///@notice listingPrice: people have to py their NFT on this mrketplace

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // a way to acces the values of market items by passing the index
    mapping(uint256 => MarketItem) private idMarketItem;

    // event to log message when item sold
    event MartketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address payable seller,
        address payable owner,
        uint256 price,
        bool sold
    );

    ///@notice function to get listing price
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    ///@notice to create market item
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price cannot be zero");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        // _itemIds.increment();increments the total number of items creted by 1
        uint256 itemId = _itemIds.current();
        idMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), //addres of seller
            payable(address(0)), //no owner address yet
            price,
            false
        );

        // transfer ownership of the nft to the contract itself
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        // log this transaction
        emit MartketItemCreated(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
    }

    ///@notice function to crete sale
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint price = idMarketItem[itemId].price;
        uint tokenId = idMarketItem[itemId].tokenId;

        require(msg.value == price, "Please submit the actual price");
        // pay the seller
        idMarketItem[itemId].seller.transfer(msg.value); // transfer ownership of the nft from the contract itself to the buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idMarketItem[itemId].owner = payable(msg.sender); //mark ownership to buyer
        idMarketItem[itemId].sold = true; //mark sold as true
        _itemsSold.increment(); //increment thetotal number of items sold by 1
        payable(owner).transfer(listingPrice); //pay the owner of the nft
    }

    ///@notice total number of items unsold on our platform
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current(); //total number of items ever created
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current(); //total number  of items not sold
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            // loop through all items ever created and get unsold items
            if (idMarketItem[i + 1].owner == address(0)) {
                //yes this item has never been sold
                uint currentId = idMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items; //return the array of all unsold items
    }

    ///@notice fetch list of nfts owened by this user
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            // get only items that this user has bought
            if (idMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1; //total length
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                uint currentId = idMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    ///@notice fetch list of nfts created by this user
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            // get only items that this user has creted
            if (idMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1; //total length
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                uint currentId = idMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }


    // ..........ideas of mre functins to add
    // 1.calculated the total mount of items sold and profit made
}
