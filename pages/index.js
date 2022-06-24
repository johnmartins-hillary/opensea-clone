import { ethers } from "ethers";
import { useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../config";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { TransactionContext } from "../context/TransactionContext";
import Welcome from "../components/Welcome";
import Loader from "../components/Loader";

export default function Home() {
  const { nfts, loadingState, loadNFTs } = useContext(TransactionContext);

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    //set the price
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    //make the sale
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();

    loadNFTs();
  }

  useEffect(() => {
    loadNFTs();
  }, []);

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="px-20 py-10 text-3xl font-bold">
        NO ITEMS IN THE MARKET PLACE
      </h1>
    );

  return (
    <div className="flex flex-col justify-center mb-10">
      <Welcome />
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        {!nfts.length ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 m-4 ">
            {nfts.map((nft, i) => (
              <div key={i} className="shadow-md rounded-md relative">
                <div className="bg-pink-500 rounded-t-md  p-5">
                  <div className="rounded-sm border-4 border-pink-400">
                    <img
                      src={nft.image}
                      alt="Picture of the author"
                      className="w-full h-full object-contain"
                      // blurDataURL="data:..." automatically provided
                      // placeholder="blur" // Optional blur-up while loading
                    />
                  </div>
                </div>
                <div className="p-2 text-black bg-purple-500 rounded-b-md flex-grow font-bold">
                  <p className="text-grey-500 text-2xl font-semibold w-full my-2">
                    {nft.name}
                  </p>
                  <div>
                    <p className="text-grey-300 w-full my-2">
                      {nft.description}
                    </p>
                  </div>
                </div>
                <button
                  className="flex items-center justify-center  w-8/12 bg-pink-500 text-yellow-300 font-bold py-2 px-12 md:px-6 rounded-full absolute -bottom-5 z-50 right-2"
                  onClick={() => buyNFT(nft)}
                >
                  <p className=" text-md mb-2 font-bold text-yellow-300">
                    {nft.price} ETH
                  </p>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
