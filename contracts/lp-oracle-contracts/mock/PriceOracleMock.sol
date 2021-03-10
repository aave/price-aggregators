// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import '../interfaces/IPriceOracle.sol';

contract PriceOracleMock is IPriceOracle {
  mapping(address => uint256) private prices;

  constructor(address[] memory _tokens, uint256[] memory _prices) public {
    for (uint256 i = 0; i < _tokens.length; i++) {
      prices[_tokens[i]] = _prices[i];
    }
  }

  function getAssetPrice(address _asset) external view override returns (uint256) {
    return prices[_asset];
  }
}
