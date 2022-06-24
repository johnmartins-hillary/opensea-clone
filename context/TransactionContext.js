import React, { useState } from "react";
import { ethers } from "ethers";
import { nftmarketaddress, nftaddress } from "../config";
import Market from "../utils/NFTMarket.json";
import NFT from "../utils/NFT.json";
import axios from "axios";

export const TransactionContext = React.createContext();
export const TransactionsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [nfts, setNfts] = useState([]);
  const [nftsOwned, setNftsOwned] = useState([]);


  // loading current nfts
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/038ad1042d1d40039d7984b808bd3b64"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );

    //return an array of unsold market items
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setIsLoading(false);
    setLoadingState("loaded");

    const data2 = await marketContract.fetchItemsCreated();

    const itemsOwned = await Promise.all(
      data2.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          image: meta.data.image,
        };
        return item;
      })
    );
    /* create a filtered array of items that have been sold */
    const soldItems = itemsOwned.filter((i) => i.sold);
    setSold(soldItems);
    setNftsOwned(itemsOwned);
  }

  return (
    <TransactionContext.Provider
      value={{
        isLoading,
        loadingState,
        nfts,
        sold,
              nftsOwned,
        loadNFTs
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
