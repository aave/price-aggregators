import { task } from 'hardhat/config';
import { getDefenderRelaySigner, usingDefender } from '../scripts/helpers/defender-utils';

task('print-deployer', 'Deploy price aggregators').setAction(async (_, hre) => {
  await hre.run('set-hre');

  if (!usingDefender()) {
    throw 'missing-defender';
  }

  const signer = await getDefenderRelaySigner();

  console.log('Deployer', await signer.getAddress());
});
