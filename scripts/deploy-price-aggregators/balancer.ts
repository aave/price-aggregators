import Decimal from 'decimal.js';
import { BigNumberish, Signer } from 'ethers';
import { exit } from 'process';
import {
  BalancerSharedPoolPriceProvider__factory,
  BalancerV2SharedPoolPriceProvider__factory,
} from '../../typechain';
import { balancerMarkets, AAVE_ORACLE, MAX_PRICE_DEVIATION, BALANCER_V2_VAULT } from '../config';
import { verifyContract } from '../helpers/misc-helpers';

const deployBalancerAggregator = async (
  version: number,
  signer: Signer,
  poolAddress: string,
  vaultAddress: string,
  pegs: boolean[],
  decimals: string[],
  aaveOracle: string,
  priceDeviation: string,
  k: string,
  powerPrecision: string,
  matrix: string[][]
) => {
  switch (version) {
    case 1:
      return new BalancerSharedPoolPriceProvider__factory(signer).deploy(
        poolAddress,
        pegs,
        decimals,
        aaveOracle,
        priceDeviation,
        k,
        powerPrecision,
        matrix
      );
    case 2:
      return new BalancerV2SharedPoolPriceProvider__factory(signer).deploy(
        poolAddress,
        vaultAddress,
        pegs,
        decimals,
        aaveOracle,
        priceDeviation,
        k,
        powerPrecision,
        matrix
      );
    default:
      throw `[error] Missing factory typings for Balancer V${version}.`;
  }
};

const getBalancerAggregatorConstructorParams = (
  version: number,
  poolAddress: string,
  vaultAddress: string,
  pegs: boolean[],
  decimals: string[],
  aaveOracle: string,
  priceDeviation: string,
  k: string,
  powerPrecision: string,
  matrix: string[][]
) => {
  switch (version) {
    case 1:
      return [
        poolAddress,
        pegs.map((x) => x.toString()),
        decimals,
        aaveOracle,
        priceDeviation,
        k,
        powerPrecision,
        matrix,
      ];
    case 2:
      return [
        poolAddress,
        vaultAddress,
        pegs.map((x) => x.toString()),
        decimals,
        aaveOracle,
        priceDeviation,
        k,
        powerPrecision,
        matrix,
      ];
    default:
      throw `[error] Missing constructor params for Balancer V${version}`;
  }
};

export async function setBptAggs(deployList: string[], signer: Signer, version: number) {
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

    let matrix: string[][] = [];

    for (let i = 1; i <= 20; i++) {
      matrix.push([
        new Decimal(10).pow(i).times(ether).toFixed(0),
        new Decimal(10).pow(i).pow(w1).times(ether).toFixed(0),
        new Decimal(10).pow(i).pow(w2).times(ether).toFixed(0),
      ]);
    }
    // Deployment
    console.log('- Deploying BPT aggregator', balancerPools[i].address);
    const bptAggregator = await deployBalancerAggregator(
      version,
      signer,
      balancerPools[i].address,
      BALANCER_V2_VAULT,
      balancerPools[i].peg,
      balancerPools[i].decimals.map((x) => x.toString()),
      AAVE_ORACLE,
      MAX_PRICE_DEVIATION,
      k,
      '100000000',
      matrix
    );

    await bptAggregator.deployTransaction.wait(7);
    console.log(
      '- Deployed BPT aggregator for pair %s at address %s',
      balancerPools[i].address,
      bptAggregator.address
    );
    aggregatorAddresses.push(bptAggregator.address);

    // Verification of contract at block explorer or Tenderly
    const constructorParams = getBalancerAggregatorConstructorParams(
      version,
      balancerPools[i].address,
      BALANCER_V2_VAULT,
      balancerPools[i].peg,
      balancerPools[i].decimals.map((x) => x.toString()),
      AAVE_ORACLE,
      MAX_PRICE_DEVIATION,
      k,
      '100000000',
      matrix
    );
    await verifyContract('BalancerSharedPoolPriceProvider', bptAggregator, constructorParams);
  }

  console.log('- Balancer Addresses');
  aggregatorAddresses.forEach((address, i) => {
    console.log(balancerPools[i].name, address);
  });
}
