// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {SafeMath} from '../open-zeppelin/SafeMath.sol';
import {Address} from '../open-zeppelin/Address.sol';
import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';
import {ICurve} from '../interfaces/ICurve.sol';
import {ICurveGauge} from '../interfaces/ICurveGauge.sol';
import {ICurveToken} from '../interfaces/ICurveToken.sol';
import {ICurvePriceProvider} from '../interfaces/ICurvePriceProvider.sol';

/**
 * @title CurvePriceProvider
 * @notice Price provider for Curve liquidity tokens, with state variables (NON-OPTIMIZED)
 * @author Aave
 */
contract CurveGaugePriceProvider is ICurvePriceProvider {
  using Address for address;
  using SafeMath for uint256;

  IPriceOracleGetter internal immutable AAVE_ORACLE;
  address internal immutable TOKEN;
  address internal immutable POOL;
  uint256 internal immutable PLATFORM_ID;

  address[] internal _subTokens;

  event Setup(address token, uint256 platformId, IPriceOracleGetter aaveOracle);

  constructor(
    IPriceOracleGetter aaveOracle,
    address token,
    uint256 platformId,
    address[] memory subTokens
  ) public {
    AAVE_ORACLE = aaveOracle;
    TOKEN = token;
    POOL = ICurveToken(ICurveGauge(token).lp_token()).minter();
    PLATFORM_ID = platformId;
    _subTokens = subTokens;
    emit Setup(token, platformId, aaveOracle);
  }

  /**
   * @dev Returns the address of the underlying token of the Curve token with lowest price and its price
   * @return (address, uint256)
   */
  function getTokensMinPrice() public view override returns (address, uint256) {
    address[] memory subTokens = getSubTokens();
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
  function getAaveOracle() public view override returns (IPriceOracleGetter) {
    return AAVE_ORACLE;
  }

  /**
   * @dev Returns the address of the Curve token
   * @return address
   */
  function getToken() public view override returns (address) {
    return TOKEN;
  }

  /**
   * @dev Returns the address of the Curve swap pool
   * @return address
   */
  function getPool() public view override returns (address) {
    return POOL;
  }

  /**
   * @dev Returns the numeric id of the token's platform, used on Aave's infrastructure
   * @return uint256
   */
  function getPlatformId() public view override returns (uint256) {
    return PLATFORM_ID;
  }

  /**
   * @dev Returns the addresses of the underlying tokens of the Curve token
   * @return address[]
   */
  function getSubTokens() public view override returns (address[] memory) {
    return _subTokens;
  }
}
