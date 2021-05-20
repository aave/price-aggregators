// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.6.6;

interface IPriceOracleGetter {
  function getAssetPrice(address _asset) external view returns (uint256);
}
