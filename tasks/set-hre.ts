import { task } from 'hardhat/config';
import { setHRE } from '../scripts/misc-helpers';

task(`set-hre`, `Inits the DRE, to have access to all the plugins' objects`).setAction(
  async (_, _HRE) => {
    await setHRE(_HRE);
    return _HRE;
  }
);
