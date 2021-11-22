import { setBptAggs } from '../scripts/balancer/deployments';
import { setUniAggs } from '../scripts/uniswap/deployments';
import { task } from 'hardhat/config';

const { signerAddress } = require('../secrets.json');

task('deploy-harcoded-curve-providers', 'Deploy price aggregators', async (_, hre) => {
  // Make HRE be available in other modules
  await hre.run('set-hre');
});
