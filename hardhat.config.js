require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: {
        version: "0.8.28",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
          },
        sepolia: {
            url: "https://rpc.sepolia.org",
            accounts: ["48d0e61708bcc18e9804b1891fe7f7082b3a07a0e84cf6fc9a0f5fcdcb928cc6"], // کلید خصوصی کیف پول شما
        },
    },
};