import { Contract } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { tEthereumAddress } from '../types';
import { HRE } from './misc-helpers';

export const usingTenderly = () =>
  HRE &&
  ((HRE as HardhatRuntimeEnvironment).network.name.includes('tenderly') ||
    process.env.TENDERLY === 'true');

export const verifyAtTenderly = async (id: string, address: tEthereumAddress) => {
  console.log('\n- Doing Tenderly contract verification of', id);
  try {
    const a = await HRE.tenderly.push([{ name: id, address: address }]);
  } catch (err) {}
};
