
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/7e046c766d1f4980b646167e910954ee", // Replace this
      accounts: ["5c6e561129ffebe183d5680d52bbe696f0cdb41923787fbb71af36614bfa5476"] // Replace this
    }
  },
  etherscan: {
    apiKey: {
      sepolia: "Z6K2V14MNJPG17NK8SHMAJ9XIJXX3CFJG4" // Replace this
    }
  }
};
