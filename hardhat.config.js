require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privteKey = fs.readFileSync(".secret").toString();
const projectId = "1846bb5edac44abb8e47ebc9badc770c";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
    },
    mombai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privteKey],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privteKey],
    },
  },
  solidity: "0.8.4",
};
