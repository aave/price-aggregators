// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

interface BPoolV2 {
  function getNormalizedWeight(address token) external view returns (uint256);

  function totalSupply() external view returns (uint256);

  function getPoolId() external view returns (bytes32);
}
