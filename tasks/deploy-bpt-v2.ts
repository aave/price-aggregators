import { setBptAggs } from '../scripts/deploy-price-aggregators/balancer';
import { task } from 'hardhat/config';
import { balancerV2Markets } from '../scripts/config';

task('deploy-bpt-v2-aggregators', 'Deploy price aggregators', async (_, hre) => {
  let { signerAddress } = require('../secrets.json');

  // Make HRE be available in other modules
  await hre.run('set-hre');

  // Filter pool names you dont want to deploy due deployment re-runs
  const balancerDeployList: string[] = balancerV2Markets.map((x) => x.name);

  if (!signerAddress) {
    console.log('[deploy-bpt-v2-aggregators] Using first address');
  }

  const signer = hre.ethers.provider.getSigner(signerAddress);

  await setBptAggs(balancerDeployList, signer, 2);
});
