// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

interface BPoolV2 {
  function getNormalizedWeights() external view returns (uint256[] memory);

  function totalSupply() external view returns (uint256);

  function getPoolId() external view returns (bytes32);
}
