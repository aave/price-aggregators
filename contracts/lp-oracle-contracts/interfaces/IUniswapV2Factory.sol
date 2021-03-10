// SPDX-License-Identifier: agpl-3.0

pragma solidity 0.6.12;

interface IUniswapV2Factory {
  function feeTo() external view returns (address);
}
