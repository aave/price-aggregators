import { Signer } from 'ethers';
// @ts-ignore
import {
  evmRevert,
  evmSnapshot,
  getEthersSigners,
  HRE,
} from '../../../scripts/helpers/misc-helpers';
import {
  getCurvePriceProvider,
  getMockAaveOracle,
  getMockCurve,
} from '../../../scripts/curve/getters';
import { tEthereumAddress } from '../../../scripts/types';
import { CurvePriceProvider } from '../../../typechain/CurvePriceProvider';
import { MockAaveOracle } from '../../../typechain/MockAaveOracle';
import { MockCurve } from '../../../typechain/MockCurve';

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  deployer: SignerWithAddress;
  users: SignerWithAddress[];
  curvePriceProvider: CurvePriceProvider;
  aaveOracle: MockAaveOracle;
  curveToken: MockCurve;
}

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  if (HRE.network.name === 'hardhat') {
    buidlerevmSnapshotId = id;
  }
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  curvePriceProvider: {} as CurvePriceProvider,
  aaveOracle: {} as MockAaveOracle,
  curveToken: {} as MockCurve,
} as TestEnv;

export async function initializeMakeSuite() {
  const [_deployer, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  testEnv.deployer = deployer;
  testEnv.curvePriceProvider = await getCurvePriceProvider();
  testEnv.aaveOracle = await getMockAaveOracle();
  testEnv.curveToken = await getMockCurve();
}

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      setBuidlerevmSnapshotId(await evmSnapshot());
    });
    tests(testEnv);
    after(async () => {
      await evmRevert(buidlerevmSnapshotId);
    });
  });
}
