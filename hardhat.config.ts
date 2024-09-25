import 'dotenv/config'

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';


// dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          evmVersion: "paris",
        }
      },
      {
        version: "0.8.9",
        settings: {
          evmVersion: "paris",
        }

      },
      {
        version: "0.8.18",
        settings: {
          evmVersion: "paris",
        }
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200000000
      }
    },

  },
  typechain: {
    outDir: './typechain-types',
    target: 'ethers-v6',
    node16Modules: false,
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rollux: {
      url: process.env.ROLLUX_URL || "https://rpc.rollux.com",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rollux_testnet: {
      url: process.env.ROLLUX_TESTNET_URL || "https://rpc-tanenbaum.rollux.com",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bsc_testnet: {
      url: process.env.BSC_TESTNET_URL || "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "bsc_testnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com/",
        },
      },
      {
        network: "rollux",
        chainId: 570,
        urls: {
          apiURL: "https://explorer.rollux.com/api",
          browserURL: "https://explorer.rollux.com/",
        },
      },
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io/",
        },
      },
      {
        network: "rollux_testnet",
        chainId: 57000,
        urls: {
          apiURL: "https://rollux.tanenbaum.io/api",
          browserURL: "https://rollux.tanenbaum.io/",
        },
      }
    ]
  },
  // sourcify: {
  //   enabled: true
  // }
};

export default config;
