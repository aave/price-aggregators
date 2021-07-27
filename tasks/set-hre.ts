import { task } from 'hardhat/config';
import { HRE, setHRE } from '../scripts/helpers/misc-helpers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task(`set-hre`, `Inits the HRE, to have access to all the plugins' objects`).setAction(
  async (_, _HRE) => {
    if (HRE) {
      return;
    }
    if (
      (_HRE as HardhatRuntimeEnvironment).network.name.includes('tenderly') ||
      process.env.TENDERLY === 'true'
    ) {
      console.log('- Setting up Tenderly provider');
      const net = _HRE.tenderly.network();

      if (process.env.TENDERLY_FORK_ID && process.env.TENDERLY_HEAD_ID) {
        console.log('- Connecting to a Tenderly Fork');
        await net.setFork(process.env.TENDERLY_FORK_ID);
        await net.setHead(process.env.TENDERLY_HEAD_ID);
      } else {
        console.log('- Creating a new Tenderly Fork');
        await net.initializeFork();
      }
      const provider = new _HRE.ethers.providers.Web3Provider(net);
      _HRE.ethers.provider = provider;
      console.log('- Initialized Tenderly fork:');
      console.log('  - Fork: ', net.getFork());
      console.log('  - Head: ', net.getHead());
    }

    console.log('- Enviroment');
    if (process.env.FORK) {
      console.log('  - Fork Mode activated at network: ', process.env.FORK);
      if (_HRE?.config?.networks?.hardhat?.forking?.url) {
        console.log('  - Provider URL:', _HRE.config.networks.hardhat.forking?.url?.split('/')[2]);
      } else {
        console.error(
          `[FORK][Error], missing Provider URL for "${_HRE.network.name}" network. Fill the URL at './helper-hardhat-config.ts' file`
        );
      }
    }
    console.log('  - Network :', _HRE.network.name);

    setHRE(_HRE);
    return _HRE;
  }
);
