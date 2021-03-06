require("babel-register");
require("babel-polyfill");

module.exports = {
  networks: {
    development: {
      //host: "52.78.70.151",
      host: "127.0.0.1",
      port: 7545,  // 8545
      network_id: "*", // Match any network id
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "pragma",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
