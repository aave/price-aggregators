import { Contract } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { HRE } from './misc-helpers';

export const usingTenderly = () =>
  HRE &&
  ((HRE as HardhatRuntimeEnvironment).network.name.includes('tenderly') ||
    process.env.TENDERLY === 'true');

export const verifyAtTenderly = async (id: string, instance: Contract) => {
  console.log('\n- Doing Tenderly contract verification of', id);
  try {
    const a = await HRE.tenderly.verify([{ name: id, address: instance.address }]);
  } catch (err) {}
};
