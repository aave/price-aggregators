// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';

interface ICurvePriceProvider {
  function getTokensMinPrice() external view returns (address, uint256);

  function latestAnswer() external view returns (int256);

  function getAaveOracle() external view returns (IPriceOracleGetter);

  function getToken() external view returns (address);

  function getPool() external view returns (address);

  function getPlatformId() external view returns (uint256);

  function getSubTokens() external view returns (address[] memory);
}
