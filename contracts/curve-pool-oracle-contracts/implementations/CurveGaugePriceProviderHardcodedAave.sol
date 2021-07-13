// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {SafeMath} from '../open-zeppelin/SafeMath.sol';
import {Address} from '../open-zeppelin/Address.sol';
import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';
import {ICurve} from '../interfaces/ICurve.sol';
import {ICurvePriceProviderPureAave} from '../interfaces/ICurvePriceProviderPureAave.sol';

/**
 * @title CurvePriceProviderHardcoded
 * @notice Price provider for Curve aave pool liquidity tokens, with optimized with constants
 * @author Aave
 */
contract CurvePriceProviderHardcodedAave is ICurvePriceProviderPureAave {
  using Address for address;
  using SafeMath for uint256;

  event Setup(address token, uint256 platformId, IPriceOracleGetter aaveOracle);

  constructor() public {
    emit Setup(getToken(), getPlatformId(), getAaveOracle());
  }

  /**
   * @dev Returns the address of the underlying token of the Curve token with lowest price and its price
   * @return (address, uint256)
   */
  function getTokensMinPrice() public view override returns (address, uint256) {
    address[3] memory subTokens = getSubTokens();
    address minToken = subTokens[0];
    IPriceOracleGetter aaveOracle = getAaveOracle();
    uint256 minPrice = aaveOracle.getAssetPrice(minToken);
    uint256 cachedLength = subTokens.length;
    for (uint256 i = 1; i < cachedLength; i++) {
      address minCandidate = subTokens[i];
      uint256 minCandidatePrice = aaveOracle.getAssetPrice(minCandidate);
      if (minCandidatePrice < minPrice) {
        minPrice = minCandidatePrice;
        minToken = minCandidate;
      }
    }
    return (minToken, minPrice);
  }

  /**
   * @dev Returns the price of the Curve token
   * @return uint256
   */
  function latestAnswer() public view override returns (int256) {
    (, uint256 tokensMinPrice) = getTokensMinPrice();

    return int256(tokensMinPrice.mul(ICurve(getPool()).get_virtual_price()).div(1e18));
  }

  /**
   * @dev Returns the address of the Aave oracle, from where prices are fetched
   * @return IPriceOracleGetter
   */
  function getAaveOracle() public pure override returns (IPriceOracleGetter) {
    // AaveOracleV2 Tenderly fork address
    return IPriceOracleGetter(0x0000000000000000000000000000000000000000);
  }

  /**
   * @dev Returns the address of the Curve token
   * @return address
   */
  function getToken() public pure override returns (address) {
    return 0xd662908ADA2Ea1916B3318327A97eB18aD588b5d;
  }

  /**
   * @dev Returns the address of the Curve swap pool
   * @return address
   */
  function getPool() public pure override returns (address) {
    return 0xDeBF20617708857ebe4F679508E7b7863a8A8EeE;
  }

  /**
   * @dev Returns the numeric id of the token's platform, used on Aave's infrastructure
   * @return uint256
   */
  function getPlatformId() public pure override returns (uint256) {
    return 3;
  }

  /**
   * @dev Returns the addresses of the underlying tokens of the Curve token
   * @return address[]
   */
  function getSubTokens() public pure override returns (address[3] memory) {
    return [
      address(0x6B175474E89094C44Da98b954EedeAC495271d0F),
      address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48),
      address(0xdAC17F958D2ee523a2206206994597C13D831ec7)
    ];
  }
}
