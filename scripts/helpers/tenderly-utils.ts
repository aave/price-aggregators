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
    const a = await HRE.tenderly.network().verify([`${id}:${instance.address}`]);
    console.log('a', a);
  } catch (err) {}
  console.log(`  - Verified ${id} at Tenderly!`);
};
