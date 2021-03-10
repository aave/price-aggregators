// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import '../interfaces/IUniswapV2Pair.sol';

contract UniswapV2PairMock is IUniswapV2Pair {
  address _factory;
  address _token_0;
  address _token_1;
  uint112 _reserve0;
  uint112 _reserve1;
  uint256 _supply;
  uint256 _kLast;

  constructor(
    address __factory,
    address __token_0,
    address __token_1,
    uint112 __reserve0,
    uint112 __reserve1,
    uint256 __supply,
    uint256 __kLast
  ) public {
    _factory = __factory;
    _token_0 = __token_0;
    _token_1 = __token_1;
    _reserve0 = __reserve0;
    _reserve1 = __reserve1;
    _supply = __supply;
    _kLast = __kLast;
  }

  function totalSupply() external view override returns (uint256) {
    return _supply;
  }

  function token0() external view override returns (address) {
    return _token_0;
  }

  function token1() external view override returns (address) {
    return _token_1;
  }

  function getReserves()
    external
    view
    override
    returns (
      uint112,
      uint112,
      uint32
    )
  {
    return (_reserve0, _reserve1, uint32(block.timestamp));
  }

  function kLast() external view override returns (uint256) {
    return _kLast;
  }

  function factory() external view override returns (address) {
    return _factory;
  }
}
