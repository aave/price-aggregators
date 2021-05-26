import { task } from 'hardhat/config';
import { deployCurvePriceProvider } from '../scripts/curve/deployments';
import { usingTenderly } from '../scripts/helpers/tenderly-utils';

task('deploy-curve-price-provider', 'Deploy price aggregators')
  .addParam('aaveOracle', '')
  .addParam('gaugeToken', '')
  .addParam('platformId', '')
  .addParam('subTokens', '')
  .setAction(async ({ aaveOracle, gaugeToken, platformId, subTokens }, hre) => {
    // Make HRE be available in other modules
    await hre.run('set-hre');

    const underlyingTokens = subTokens.split(',');

    const provider = await deployCurvePriceProvider([
      aaveOracle,
      gaugeToken,
      Number(platformId),
      underlyingTokens,
    ]);

    console.log('- Deployed Curve Price Provider at', provider.address);
    console.log('  AaveOracle', aaveOracle);
    console.log('  GaugeToken', gaugeToken);
    console.log('  PlatformId', platformId);
    console.log('  SubTokens', subTokens);
    if (usingTenderly()) {
      const postDeployHead = hre.tenderlyRPC.getHead();
      const postDeployFork = hre.tenderlyRPC.getFork();
      console.log('Tenderly Info');
      console.log('- Head', postDeployHead);
      console.log('- Fork', postDeployFork);
    }
  });
