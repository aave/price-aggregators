// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {ICurve} from "../interfaces/ICurve.sol";

contract MockCurve is ICurve {
    function get_virtual_price() external view override returns (uint256) {
        return 1047095232694943228;
    }
}


