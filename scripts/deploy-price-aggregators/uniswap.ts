import { Signer } from 'ethers';
import { UniswapV2PriceProvider__factory } from '../../typechain';
import '@nomiclabs/hardhat-ethers';
import { AAVE_ORACLE, MAX_PRICE_DEVIATION, uniswapMarkets } from '../config';
import { exit } from 'process';
import { verifyContract } from '../misc-helpers';

export async function setUniAggs(deployList: string[], signer: Signer) {
  const uniswapPools = uniswapMarkets.filter(({ name }) => {
    return deployList.includes(name);
  });

  if (uniswapPools.length !== deployList.length) {
    console.error('Deploy list mismatch, check names at scripts/config.ts');
    return exit(1);
  }

  const aggregatorAddresses: string[] = [];

  for (let i = 0; i < uniswapPools.length; i++) {
    const uniAggregator = await new UniswapV2PriceProvider__factory(signer).deploy(
      uniswapPools[i].address,
      uniswapPools[i].peg,
      uniswapPools[i].decimals,
      AAVE_ORACLE,
      MAX_PRICE_DEVIATION
    );
    console.log('- Deploying UNI-V2', uniswapPools[i].address);
    await uniAggregator.deployTransaction.wait(7);
    console.log(
      `- Deployed Uni-V2 aggregator ${uniswapPools[i].name} for pair %s at address %s`,
      uniswapPools[i].address,
      uniAggregator.address
    );
    aggregatorAddresses.push(uniAggregator.address);

    await verifyContract(
      uniAggregator.address,
      'contracts/lp-oracle-contracts/aggregators/UniswapV2PriceProvider.sol:UniswapV2PriceProvider',
      [
        uniswapPools[i].address,
        uniswapPools[i].peg,
        uniswapPools[i].decimals,
        AAVE_ORACLE,
        MAX_PRICE_DEVIATION,
      ]
    );
  }
  console.log('- Uniswap Addresses');
  aggregatorAddresses.forEach((address, i) => {
    console.log(uniswapPools[i].name, address);
  });
}
