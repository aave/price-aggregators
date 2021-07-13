import { task } from 'hardhat/config';
import { HRE, setHRE } from '../scripts/helpers/misc-helpers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { formatEther } from 'ethers/lib/utils';

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
      if (process.env.TENDERLY_FORK_ID && process.env.TENDERLY_HEAD_ID) {
        console.log('- Connecting to a Tenderly Fork');
        _HRE.tenderlyRPC.setFork(process.env.TENDERLY_FORK_ID);
        _HRE.tenderlyRPC.setHead(process.env.TENDERLY_HEAD_ID);
      } else {
        console.log('- Creating a new Tenderly Fork');
        await _HRE.tenderlyRPC.initializeFork();
      }
      const provider = new _HRE.ethers.providers.Web3Provider(_HRE.tenderlyRPC as any);
      _HRE.ethers.provider = provider;
      console.log('- Initialized Tenderly fork:');
      console.log('  - Fork: ', _HRE.tenderlyRPC.getFork());
      console.log('  - Head: ', _HRE.tenderlyRPC.getHead());
      console.log('  - First account:', await (await _HRE.ethers.getSigners())[0].getAddress());
      console.log(
        '  - Balance:',
        formatEther(await (await _HRE.ethers.getSigners())[0].getBalance())
      );
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
