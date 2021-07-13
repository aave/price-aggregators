import { setBptAggs } from '../scripts/balancer/deployments';
import { setUniAggs } from '../scripts/uniswap/deployments';
import { task } from 'hardhat/config';

const { signerAddress } = require('../secrets.json');

task('deploy-price-aggregators', 'Deploy price aggregators', async (_, hre) => {
  // Make HRE be available in other modules
  await hre.run('set-hre');

  // Uncomment pool names you dont want to deploy due deployment re-runs
  const balancerDeployList = ['BptWBTCWETH', 'BptBALWETH'];
  const uniswapDeployList = [
    'UniDAIWETH',
    'UniWBTCWETH',
    'UniAAVEWETH',
    'UniBATWETH',
    'UniDAIUSDC',
    'UniCRVWETH',
    'UniLINKWETH',
    'UniMKRWETH',
    'UniRENWETH',
    'UniSNXWETH',
    'UniUNIWETH',
    'UniUSDCWETH',
    'UniWBTCUSDC',
    'UniYFIWETH',
  ];

  if (!signerAddress) {
    console.error(
      "Missing signer address. Please re-run command and provide an address to 'signerAddress' field at secrets.json."
    );
  }

  const signer = hre.ethers.provider.getSigner(signerAddress);

  await setUniAggs(uniswapDeployList, signer);
  await setBptAggs(balancerDeployList, signer);
});
