// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

interface BPool {
  function getFinalTokens() external view returns (address[] memory tokens);

  function getNormalizedWeight(address token) external view returns (uint256);

  function getBalance(address token) external view returns (uint256);

  function totalSupply() external view returns (uint256);
}
