// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import '../interfaces/IUniswapV2Factory.sol';

contract UniswapV2FactoryMock is IUniswapV2Factory {
  address _feeTo;

  constructor(address __feeTo) public {
    _feeTo = __feeTo;
  }

  function feeTo() external view override returns (address) {
    return _feeTo;
  }
}
