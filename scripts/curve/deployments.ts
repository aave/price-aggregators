import { getFirstSigner, withSaveAndVerify } from '../helpers/misc-helpers';
import { eContractId, tEthereumAddress } from '../types';
import { CurvePriceProvider__factory } from '../../typechain/factories/CurvePriceProvider__factory';
import { MockAaveOracle__factory } from '../../typechain/factories/MockAaveOracle__factory';
import { MockCurve__factory } from '../../typechain/factories/MockCurve__factory';
import { CurveGaugePriceProvider__factory } from '../../typechain';

export const deployCurvePriceProvider = async (
  [aaveOracle, token, platformId, subTokens]: [
    tEthereumAddress,
    tEthereumAddress,
    number,
    tEthereumAddress[]
  ],
  verify?: boolean
) => {
  const args: [string, string, string, string[]] = [
    aaveOracle,
    token,
    platformId.toString(),
    subTokens,
  ];
  return withSaveAndVerify(
    await new CurvePriceProvider__factory(await getFirstSigner()).deploy(...args),
    eContractId.CurvePriceProvider,
    args,
    verify
  );
};

export const deployCurveGaugePriceProvider = async (
  [aaveOracle, token, platformId, subTokens]: [
    tEthereumAddress,
    tEthereumAddress,
    number,
    tEthereumAddress[]
  ],
  verify?: boolean
) => {
  const args: [string, string, string, string[]] = [
    aaveOracle,
    token,
    platformId.toString(),
    subTokens,
  ];
  return withSaveAndVerify(
    await new CurveGaugePriceProvider__factory(await getFirstSigner()).deploy(...args),
    eContractId.CurveGaugePriceProvider,
    args,
    verify
  );
};

export const deployMockAaveOracle = async (verify?: boolean) =>
  withSaveAndVerify(
    await new MockAaveOracle__factory(await getFirstSigner()).deploy(),
    eContractId.MockAaveOracle,
    [],
    verify
  );

export const deployMockCurve = async (verify?: boolean) =>
  withSaveAndVerify(
    await new MockCurve__factory(await getFirstSigner()).deploy(),
    eContractId.MockCurve,
    [],
    verify
  );
