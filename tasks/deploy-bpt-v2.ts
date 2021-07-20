import { setBptAggs } from '../scripts/deploy-price-aggregators/balancer';
import { task } from 'hardhat/config';
import { balancerV2Markets } from '../scripts/config';
import { getDefenderRelaySigner, usingDefender } from '../scripts/helpers/defender-utils';
import { Signer } from 'ethers';

const { signerAddress } = require('../secrets.json');

task('deploy-bpt-v2-aggregators', 'Deploy price aggregators', async (_, hre) => {
  // Make HRE be available in other modules
  await hre.run('set-hre');

  let signer: Signer = hre.ethers.provider.getSigner(signerAddress);

  if (usingDefender()) {
    signer = await getDefenderRelaySigner();
  }

  // Filter pool names you dont want to deploy due deployment re-runs
  const balancerDeployList: string[] = balancerV2Markets.map((x) => x.name);

  await setBptAggs(balancerDeployList, signer, 2);
});
