import { formatEther } from '@ethersproject/units';
import { DefenderRelaySigner, DefenderRelayProvider } from 'defender-relay-client/lib/ethers';
import { Signer } from 'ethers';
import { HRE, impersonateAccountsHardhat } from './misc-helpers';
import { usingTenderly } from './tenderly-utils';

export const usingDefender = () => process.env.DEFENDER === 'true';

export const getDefenderRelaySigner = async () => {
  const { DEFENDER_API_KEY, DEFENDER_SECRET_KEY } = process.env;
  let defenderSigner: Signer;

  if (!DEFENDER_API_KEY || !DEFENDER_SECRET_KEY) {
    throw new Error('Defender secrets required');
  }

  const credentials = { apiKey: DEFENDER_API_KEY, apiSecret: DEFENDER_SECRET_KEY };

  defenderSigner = new DefenderRelaySigner(credentials, new DefenderRelayProvider(credentials), {
    speed: 'fastest',
  });

  const defenderAddress = await defenderSigner.getAddress();
  console.log('  - Using Defender Relay: ', defenderAddress);

  // Replace signer if FORK=main is active
  if (process.env.FORK === 'main') {
    console.log('  - Impersonating Defender Relay');
    await impersonateAccountsHardhat([defenderAddress]);
    defenderSigner = await HRE.ethers.getSigner(defenderAddress);
  }
  // Replace signer if Tenderly network is active
  if (usingTenderly()) {
    console.log('  - Impersonating Defender Relay via Tenderly');
    defenderSigner = await HRE.ethers.getSigner(defenderAddress);
  }
  console.log('  - Balance: ', formatEther(await defenderSigner.getBalance()));

  return defenderSigner;
};