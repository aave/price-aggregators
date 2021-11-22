import { verifyBalOracles } from '../scripts/deploy-price-aggregators/balancer';
import { task } from 'hardhat/config';

task('verify-bpt-v2-aggregators', 'Verify price aggregators').setAction(async (_, hre) => {
  // Make HRE be available in other modules
  await hre.run('set-hre');

  // Filter pool names you don't want to deploy due deployment re-runs
  const verifyList: [string, string][] = [
    ['BptV2USDTWETH', '0x5FF2f23407143E6c9864Cd5c759F6A90baf63BDF'],
  ];

  await verifyBalOracles(verifyList, 2);
});
