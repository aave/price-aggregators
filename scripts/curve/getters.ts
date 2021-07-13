import { CurvePriceProvider } from '../../typechain/CurvePriceProvider';
import { MockAaveOracle } from '../../typechain/MockAaveOracle';
import { MockCurve } from '../../typechain/MockCurve';
import { getContract, getDb, HRE } from '../helpers/misc-helpers';
import { eContractId, tEthereumAddress } from '../types';

export const getCurvePriceProvider = async (address?: tEthereumAddress) => {
  return await getContract<CurvePriceProvider>(
    'CurvePriceProvider',
    address ||
      (await getDb().get(`${eContractId.CurvePriceProvider}.${HRE.network.name}`).value()).address
  );
};

export const getMockAaveOracle = async (address?: tEthereumAddress) => {
  return await getContract<MockAaveOracle>(
    'MockAaveOracle',
    address ||
      (await getDb().get(`${eContractId.MockAaveOracle}.${HRE.network.name}`).value()).address
  );
};

export const getMockCurve = async (address?: tEthereumAddress) => {
  return await getContract<MockCurve>(
    eContractId.MockCurve,
    address || (await getDb().get(`${eContractId.MockCurve}.${HRE.network.name}`).value()).address
  );
};
