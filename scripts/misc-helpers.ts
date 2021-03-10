import { HardhatRuntimeEnvironment } from 'hardhat/types';

export let HRE: HardhatRuntimeEnvironment = {} as HardhatRuntimeEnvironment;

export const setHRE = (_HRE: HardhatRuntimeEnvironment) => {
  HRE = _HRE;
};

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function verifyContract(_address: string, contractPath: string, args: any) {
  let count = 0;
  let maxTries = 5;
  while (true) {
    try {
      console.log('Verifying contract at', _address);
      await HRE.run('verify:verify', {
        address: _address,
        constructorArguments: args,
        contract: contractPath, //"contracts/lp-oracle-contracts/mock/Token.sol:Token",
      });
      return;
    } catch (error) {
      if (++count == maxTries) {
        console.log(
          'Failed to verify contract at path %s at address %s, error: %s',
          _address,
          error
        );
      }
      throw 'Verification failed';
    }
    await delay(5000);
  }
}
