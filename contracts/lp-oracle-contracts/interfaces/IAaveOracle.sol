// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

/************
@title IAaveOracle interface
@notice Interface for the Aave price oracle.*/
interface IAaveOracle {
  /***********
    @dev returns the asset price in ETH
     */
  function getAssetPrice(address _asset) external view returns (uint256);

  function owner() external view returns (address);

  function setAssetSources(address[] calldata assets, address[] calldata sources) external;
}
