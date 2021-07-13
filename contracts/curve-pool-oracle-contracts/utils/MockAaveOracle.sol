// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {IPriceOracleGetter} from "../interfaces/IPriceOracleGetter.sol";

contract MockAaveOracle is IPriceOracleGetter {
    function getAssetPrice(address _asset) external view override returns (uint256) {
        if (_asset == address(0xdAC17F958D2ee523a2206206994597C13D831ec7)) { // USDT
            return 2918049835748722;
        } else if (_asset == address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)) { // USDC
            return 2894390033038289;
        } else if (_asset == address(0x0000000000085d4780B73119b644AE5ecd22b376)) { // TUSD
            return 2905560380296790;
        } else if (_asset == address(0x6B175474E89094C44Da98b954EedeAC495271d0F)) { // DAI
            return 2965175240968478;
        }

        revert("INVALID_ASSET");
    }
}


