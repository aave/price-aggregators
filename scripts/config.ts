export interface BalancerPoolInfo {
  name: string;
  address: string;
  weights: number[];
  peg: boolean[];
  decimals: number[];
}

export interface UniswapPoolInfo {
  name: string;
  address: string;
  peg: boolean[];
  decimals: number[];
}
export const MAX_PRICE_DEVIATION = '50000000000000000';

export const AAVE_ORACLE = '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9';

export const balancerMarkets = [
  {
    name: 'BptWBTCWETH',
    address: '0x1efF8aF5D577060BA4ac8A29A13525bb0Ee2A3D5',
    peg: [true, false],
    decimals: [18, 8],
    weights: [0.5, 0.5],
  },
  {
    name: 'BptBALWETH',
    address: '0x59A19D8c652FA0284f44113D0ff9aBa70bd46fB4',
    peg: [false, true],
    decimals: [18, 18],
    weights: [0.8, 0.2],
  },
];

export const uniswapMarkets: UniswapPoolInfo[] = [
  {
    name: 'UniDAIWETH',
    address: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
    peg: [false, true],
    decimals: [18, 18],
  },
  {
    name: 'UniWBTCWETH',
    address: '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940',
    peg: [false, true],
    decimals: [8, 18],
  },
  {
    name: 'UniAAVEWETH',
    address: '0xDFC14d2Af169B0D36C4EFF567Ada9b2E0CAE044f',
    peg: [false, true],
    decimals: [18, 18],
  },
  {
    name: 'UniBATWETH',
    address: '0xB6909B960DbbE7392D405429eB2b3649752b4838',
    peg: [false, true],
    decimals: [18, 18],
  },
  {
    name: 'UniDAIUSDC',
    address: '0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5',
    peg: [false, false],
    decimals: [18, 6],
  },
  {
    name: 'UniCRVWETH',
    address: '0x3dA1313aE46132A397D90d95B1424A9A7e3e0fCE',
    peg: [true, false],
    decimals: [18, 18],
  },
  {
    name: 'UniLINKWETH',
    address: '0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974',
    peg: [false, true],
    decimals: [18, 18],
  },
  {
    name: 'UniMKRWETH',
    address: '0xC2aDdA861F89bBB333c90c492cB837741916A225',
    peg: [false, true],
    decimals: [18, 18],
  },
  {
    name: 'UniRENWETH',
    address: '0x8Bd1661Da98EBDd3BD080F0bE4e6d9bE8cE9858c',
    peg: [false, true],
    decimals: [18, 18],
  },
  {
    name: 'UniSNXWETH',
    address: '0x43AE24960e5534731Fc831386c07755A2dc33D47',
    peg: [false, true],
    decimals: [18, 18],
  },
  {
    name: 'UniUNIWETH',
    address: '0xd3d2E2692501A5c9Ca623199D38826e513033a17',
    peg: [false, true],
    decimals: [18, 18],
  },
  {
    name: 'UniUSDCWETH',
    address: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    peg: [false, true],
    decimals: [6, 18],
  },
  {
    name: 'UniWBTCUSDC',
    address: '0x004375Dff511095CC5A197A54140a24eFEF3A416',
    peg: [false, false],
    decimals: [8, 6],
  },
  {
    name: 'UniYFIWETH',
    address: '0x2fDbAdf3C4D5A8666Bc06645B8358ab803996E28',
    peg: [false, true],
    decimals: [18, 18],
  },
];
