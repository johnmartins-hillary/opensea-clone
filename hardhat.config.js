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
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privteKey],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privteKey],
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/038ad1042d1d40039d7984b808bd3b64",
      accounts: [
        "d0e812824c35f9717b1accf8e9da7c243039d1c8c7a4a664991356980f1eb658",
      ],
    },
  },
  solidity: "0.8.4",
};
