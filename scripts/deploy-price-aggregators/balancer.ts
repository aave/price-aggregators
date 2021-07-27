import Decimal from 'decimal.js';
import { BigNumberish, Signer } from 'ethers';
import { exit } from 'process';
import {
  BalancerSharedPoolPriceProvider,
  BalancerSharedPoolPriceProvider__factory,
  BalancerV2SharedPoolPriceProvider,
  BalancerV2SharedPoolPriceProvider__factory,
} from '../../typechain';
import {
  balancerMarkets,
  balancerV2Markets,
  AAVE_ORACLE,
  MAX_PRICE_DEVIATION,
  BALANCER_V2_VAULT,
} from '../config';
import { HRE, verifyContract, waitForTx } from '../helpers/misc-helpers';
import { usingTenderly } from '../helpers/tenderly-utils';

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
      const instance = await new BalancerSharedPoolPriceProvider__factory(signer).deploy(
        poolAddress,
        pegs,
        decimals,
        aaveOracle,
        priceDeviation,
        k,
        powerPrecision,
        matrix
      );
      await waitForTx(instance.deployTransaction);
      return instance;
    case 2:
      const contract = await new BalancerV2SharedPoolPriceProvider__factory(
        signer
      ).deploy(
        poolAddress,
        vaultAddress,
        pegs,
        decimals,
        aaveOracle,
        priceDeviation,
        k,
        powerPrecision,
        matrix,
        { gasLimit: 4000000 }
      );
      await waitForTx(contract.deployTransaction);
      return contract;
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

const getBalancerConfig = (version: number) => {
  switch (version) {
    case 1:
      return balancerMarkets;
    case 2:
      return balancerV2Markets;
    default:
      throw `[error] Missing balancer market configs for Balancer V${version}`;
  }
};

export async function setBptAggs(deployList: string[], signer: Signer, version: number) {
  const balancerPools = getBalancerConfig(version).filter(({ name }) => {
    return deployList.includes(name);
  });

  if (balancerPools.length !== deployList.length) {
    console.error('Deploy list mismatch, check names at scripts/config.ts');
    return exit(1);
  }
  let aggregatorAddresses: string[] = [];
  const ether = '1000000000000000000';

  for (let i = 0; i < balancerPools.length; i++) {
    const divisor = balancerPools[i].weights.reduce<Decimal>((acc, w, i) => {
      if (i == 0) {
        return new Decimal(w).pow(w);
      }
      return acc.mul(new Decimal(w).pow(w));
    }, new Decimal('0'));

    const k = new Decimal(ether).div(divisor).toFixed(0);

    let matrix: string[][] = [];

    for (let y = 1; y <= 20; y++) {
      const elements = [new Decimal(10).pow(y).times(ether).toFixed(0)];
      for (let wI = 0; wI < balancerPools[i].weights.length; wI++) {
        elements.push(
          new Decimal(10).pow(y).pow(balancerPools[i].weights[wI]).times(ether).toFixed(0)
        );
      }
      matrix.push(elements);
    }
    // Deployment
    console.log('- Deploying BPT aggregator', balancerPools[i].address);
    let bptAggregator: BalancerSharedPoolPriceProvider | BalancerV2SharedPoolPriceProvider;

    try {
      bptAggregator = await deployBalancerAggregator(
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
    } catch (err) {
      if (usingTenderly()) {
        const transactionLink = `https://dashboard.tenderly.co/${HRE.config.tenderly.username}/${
          HRE.config.tenderly.project
        }/fork/${HRE.tenderly.network().getFork()}/simulation/${HRE.tenderly.network().getHead()}`;
        console.error('Check tx error:', transactionLink);
      }
      throw `Error at deployment for ${balancerPools[i].name}`;
    }

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
  const mappedAggregator = aggregatorAddresses.reduce<{ [key: string]: string }>(
    (acc, address, i) => {
      console.log(balancerPools[i].name, address);
      acc[balancerPools[i].name] = address;
      return acc;
    },
    {}
  );

  return mappedAggregator;
}
