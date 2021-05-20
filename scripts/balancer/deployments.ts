import Decimal from 'decimal.js';
import { BigNumberish, Signer } from 'ethers';
import { exit } from 'process';
import { BalancerSharedPoolPriceProvider__factory } from '../../typechain';
import { balancerMarkets, AAVE_ORACLE, MAX_PRICE_DEVIATION } from '../config';
import { verifyContract } from '../helpers/misc-helpers';

export async function setBptAggs(deployList: string[], signer: Signer) {
  const balancerPools = balancerMarkets.filter(({ name }) => {
    return deployList.includes(name);
  });

  if (balancerPools.length !== deployList.length) {
    console.error('Deploy list mismatch, check names at scripts/config.ts');
    return exit(1);
  }
  let aggregatorAddresses: string[] = [];
  const ether = '1000000000000000000';

  for (let i = 0; i < balancerPools.length; i++) {
    const w1 = balancerPools[i].weights[0];
    const w2 = balancerPools[i].weights[1];
    const factor1 = new Decimal(w1).pow(w1);
    const factor2 = new Decimal(w2).pow(w2);
    const divisor = factor1.mul(factor2);
    const k = new Decimal(ether).div(divisor).toFixed(0);

    let matrix: BigNumberish[][] = [];

    for (let i = 1; i <= 20; i++) {
      matrix.push([
        new Decimal(10).pow(i).times(ether).toFixed(0),
        new Decimal(10).pow(i).pow(w1).times(ether).toFixed(0),
        new Decimal(10).pow(i).pow(w2).times(ether).toFixed(0),
      ]);
    }

    const bptAggregator = await new BalancerSharedPoolPriceProvider__factory(signer).deploy(
      balancerPools[i].address,
      balancerPools[i].peg,
      balancerPools[i].decimals,
      AAVE_ORACLE,
      MAX_PRICE_DEVIATION,
      k,
      '100000000',
      matrix
    );
    console.log('- Deploying BPT aggregator', balancerPools[i].address);
    await bptAggregator.deployTransaction.wait(7);
    console.log(
      '- Deployed BPT aggregator for pair %s at address %s',
      balancerPools[i].address,
      bptAggregator.address
    );
    aggregatorAddresses.push(bptAggregator.address);

    await verifyContract('BalancerSharedPoolPriceProvider', bptAggregator, [
      balancerPools[i].address,
      balancerPools[i].peg.map((bool) => (bool === true ? 'true' : 'false')),
      balancerPools[i].decimals.map((decimal) => decimal.toString()),
      AAVE_ORACLE,
      MAX_PRICE_DEVIATION,
      k,
      '100000000',
      matrix.toString(),
    ]);
  }

  console.log('- Balancer Addresses');
  aggregatorAddresses.forEach((address, i) => {
    console.log(balancerPools[i].name, address);
  });
}
