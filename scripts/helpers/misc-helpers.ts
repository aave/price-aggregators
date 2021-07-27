import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract, ContractTransaction } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { eContractId, tEthereumAddress } from '../types';
import { usingTenderly, verifyAtTenderly } from './tenderly-utils';
import { verifyEtherscanContract } from './etherscan-verification';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

export let HRE: HardhatRuntimeEnvironment;

export const setHRE = (_HRE: HardhatRuntimeEnvironment) => {
  HRE = _HRE;
};

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getDb = () => low(new FileSync('./deployed-contracts.json'));

export const getEthersSigners = async (): Promise<SignerWithAddress[]> =>
  await Promise.all(await HRE.ethers.getSigners());

export const getEthersSignersAddresses = async (): Promise<tEthereumAddress[]> =>
  await Promise.all((await HRE.ethers.getSigners()).map((signer) => signer.getAddress()));

export const getCurrentBlock = async () => {
  return HRE.ethers.provider.getBlockNumber();
};

export const getFirstSigner = async () => (await HRE.ethers.getSigners())[0];

export const waitForTx = async (tx: ContractTransaction) => await tx.wait(1);

export const getContract = async <ContractType extends Contract>(
  contractName: string,
  address: string
): Promise<ContractType> => (await HRE.ethers.getContractAt(contractName, address)) as ContractType;

export const withSaveAndVerify = async <ContractType extends Contract>(
  instance: ContractType,
  id: string,
  args: (string | string[] | string[][])[],
  verify?: boolean
): Promise<ContractType> => {
  await waitForTx(instance.deployTransaction);
  await registerContractInJsonDb(id, instance);
  if (verify) {
    await verifyContract(id, instance, args);
  }
  return instance;
};

export const verifyContract = async (
  id: string,
  instance: Contract,
  args: (string | string[] | string[][])[]
) => {
  if (usingTenderly()) {
    await verifyAtTenderly(id, instance);
    return instance;
  }
  await verifyEtherscanContract(instance.address, args);
  return instance;
};

export const evmSnapshot = async () => await HRE.ethers.provider.send('evm_snapshot', []);

export const evmRevert = async (id: string) => HRE.ethers.provider.send('evm_revert', [id]);

export const registerContractInJsonDb = async (contractId: string, contractInstance: Contract) => {
  const currentNetwork = HRE.network.name;
  const FORK = process.env.FORK;
  if (FORK || (currentNetwork !== 'hardhat' && !currentNetwork.includes('coverage'))) {
    console.log(`*** ${contractId} ***\n`);
    console.log(`Network: ${currentNetwork}`);
    console.log(`tx: ${contractInstance.deployTransaction.hash}`);
    console.log(`contract address: ${contractInstance.address}`);
    console.log(`deployer address: ${contractInstance.deployTransaction.from}`);
    console.log(`gas price: ${contractInstance.deployTransaction.gasPrice}`);
    console.log(`gas used: ${contractInstance.deployTransaction.gasLimit}`);
    console.log(`\n******`);
    console.log();
  }

  await getDb()
    .set(`${contractId}.${currentNetwork}`, {
      address: contractInstance.address,
      deployer: contractInstance.deployTransaction.from,
    })
    .write();
};

export const insertContractAddressInDb = async (id: eContractId, address: tEthereumAddress) =>
  await getDb()
    .set(`${id}.${HRE.network.name}`, {
      address,
    })
    .write();

export const rawInsertContractAddressInDb = async (id: string, address: tEthereumAddress) =>
  await getDb()
    .set(`${id}.${HRE.network.name}`, {
      address,
    })
    .write();

export const impersonateAccountsHardhat = async (accounts: string[]) => {
  if (process.env.TENDERLY === 'true') {
    return;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const account of accounts) {
    // eslint-disable-next-line no-await-in-loop
    await HRE.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [account],
    });
  }
};
