// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

interface ICurveGauge {
  function lp_token() external view returns (address);
}
