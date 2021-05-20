import path from 'path';
import fs from 'fs';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-typechain';
import '@tenderly/hardhat-tenderly';

// Import HRE task
import './tasks/set-hre';
import './tasks/deploy';

const { ffmnemonic, alchemyProjectId, etherscanKey, infuraProjectId } = require('./secrets.json');

// Prevent to load scripts before compilation and typechain
const SKIP_LOAD = process.env.SKIP_LOAD === 'true';
if (!SKIP_LOAD) {
  const tasksPath = path.join(__dirname, 'tasks');
  fs.readdirSync(tasksPath)
    .filter((pth) => pth.includes('.ts'))
    .forEach((task) => {
      require(`${tasksPath}/${task}`);
    });
}

export default {
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyProjectId}`,
      gasPrice: 201000000000,
      accounts: { mnemonic: ffmnemonic },
    },
    matic: {
      url: `https://rpc-mainnet.matic.network`,
      accounts: { mnemonic: ffmnemonic },
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/`,
      accounts: { mnemonic: ffmnemonic },
    },
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyProjectId}`,
        blockNumber: 11689738,
      },
    },
    tenderly: {
      url: `https://rpc.tenderly.co/fork/f551ad0a-1daf-47c0-b091-73beef4a43bb`,
    },
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${alchemyProjectId}`,
      accounts: { mnemonic: ffmnemonic },
      chainId: 42,
    },
  },
  etherscan: {
    apiKey: etherscanKey,
  },
};
