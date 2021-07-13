import rawHRE from 'hardhat';

import { Signer } from 'ethers';

import { initializeMakeSuite } from './helpers/make-suite';
import { TEST_PLATFORM_ID, TEST_SUBTOKENS } from '../../scripts/curve/constants';
import { getEthersSigners } from '../../scripts/helpers/misc-helpers';
import {
  deployMockAaveOracle,
  deployMockCurve,
  deployCurvePriceProvider,
} from '../../scripts/curve/deployments';
import { ConsoleLogger } from 'ts-generator/dist/logger';

const buildTestEnv = async (deployer: Signer, secondaryWallet: Signer) => {
  console.time('setup');

  const curveToken = await deployMockCurve();

  const aaveOracle = await deployMockAaveOracle();

  await deployCurvePriceProvider([
    aaveOracle.address,
    curveToken.address,
    TEST_PLATFORM_ID,
    TEST_SUBTOKENS,
  ]);

  console.timeEnd('setup');
};

before(async () => {
  await rawHRE.run('set-hre');
  const [deployer, secondaryWallet] = await getEthersSigners();
  console.log('-> Deploying test environment...');
  await buildTestEnv(deployer, secondaryWallet);
  await initializeMakeSuite();
  console.log('\n***************');
  console.log('Setup and snapshot finished');
  console.log('***************\n');
});
