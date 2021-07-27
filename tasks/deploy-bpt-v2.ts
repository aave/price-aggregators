import { setBptAggs } from '../scripts/deploy-price-aggregators/balancer';
import { task } from 'hardhat/config';
import { balancerV2Markets, AAVE_ORACLE, DPI_CHAINLINK, DPI_TOKEN } from '../scripts/config';
import { getDefenderRelaySigner, usingDefender } from '../scripts/helpers/defender-utils';
import { Signer } from 'ethers';
import { BalancerV2SharedPoolPriceProvider__factory, IAaveOracle__factory } from '../typechain';
import { getFirstSigner, waitForTx } from '../scripts/helpers/misc-helpers';
import { formatEther } from 'ethers/lib/utils';
import { usingTenderly } from '../scripts/helpers/tenderly-utils';

const { signerAddress } = require('../secrets.json');

task('deploy-bpt-v2-aggregators', 'Deploy price aggregators')
  .addFlag('dpiOracle')
  .addFlag('debugPrices')
  .setAction(async ({ dpiOracle, debugPrices }, hre) => {
    // Make HRE be available in other modules
    await hre.run('set-hre');

    let signer: Signer = hre.ethers.provider.getSigner(signerAddress);

    if (usingDefender()) {
      signer = await getDefenderRelaySigner();
    }

    // Sets the price provider of DPI token at Aave Oracle for debug purposes
    if (dpiOracle) {
      const aaveOracle = await IAaveOracle__factory.connect(AAVE_ORACLE, await getFirstSigner());
      const oracleSigner = hre.ethers.provider.getSigner(await aaveOracle.owner());

      await waitForTx(
        await aaveOracle.connect(oracleSigner).setAssetSources([DPI_TOKEN], [DPI_CHAINLINK])
      );
      console.log('Added DPI price provider to the Aave Oracle');
    }

    // Filter pool names you dont want to deploy due deployment re-runs
    const balancerDeployList: string[] = balancerV2Markets.map((x) => x.name);

    const aggregators: { [key: string]: string } = await setBptAggs(balancerDeployList, signer, 2);

    // List the prices of the assets for debug purposes
    if (debugPrices) {
      const names = Object.keys(aggregators);
      const addresses = Object.values(aggregators);
      for (let i = 0; i < addresses.length; i++) {
        const priceProvider = BalancerV2SharedPoolPriceProvider__factory.connect(
          addresses[i],
          await getFirstSigner()
        );
        const latestPrice = await priceProvider.latestAnswer();

        console.log(names[i], formatEther(latestPrice));
      }
    }

    if (usingTenderly()) {
      console.log('Tenderly fork status');
      console.log('====================');
      console.log('Fork ID:', hre.tenderly.network().getFork());
      console.log('Head ID:', hre.tenderly.network().getHead());
    }
  });
