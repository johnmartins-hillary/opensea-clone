const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed(); //deploy the nft market
    const marketAddress = market.address;
    console.log("marketAddress: ", marketAddress);

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed(); //deploy the nft contract
    const nftContractAddress = nft.address;
    console.log("nftContractAddress: ", nftContractAddress);

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const aunctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createToken("https://www.myTokenLocation.com");
    await nft.createToken("https://www.myTokenLocation2.com");

    await market
      .createMarketItem(nftContractAddress, 1, aunctionPrice, {
        value: listingPrice,
      })
      .then((res) => {
        console.log(res);
      });
    await market.createMarketItem(nftContractAddress, 2, aunctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: aunctionPrice });

    // fetch market Items
    let items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );

    console.log("items: ", items);
  });
});
