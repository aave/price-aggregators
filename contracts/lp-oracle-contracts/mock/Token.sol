// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {
  constructor(uint8 decimals) public ERC20('Test', 'TST') {
    _setupDecimals(decimals);
  }
}
