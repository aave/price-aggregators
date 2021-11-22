# AAVE <-> AMM Price providers

This repository contains contracts that enable the AAVE protocol to read prices for the following AMM tokens:

- Balancer
- Uniswap v2

## Security

Both Balancer and Uniswap v2 price providers have been audited by Consensys Diligence, with the report [here](https://consensys.net/diligence/audits/2020/08/aave-balancer-and-uniswap-v2-price-providers/)

# Aave <-> Curve oracles

Price provider smart contract to use Curve liquidity provider tokens in the Aave Protocol. Applicable for Curve-Compound, Y-Curve, BUSD-Curve, sUSD-Curve, REN-Curve and sBTC-Curve.

## Rationale and solution

As with any other asset, in order to list a Curve token in the Aave Protocol, it's fundamental to have a way to calculate accurately the price in wei of each unit of Curve token.

On Curve, same as on other AMMs, the calculation of this price needs to be protected from manipulations involving swaps, addition/removal of liquidity and "flash loan"-like actions. However, in this case, because of the special nature of the Curve model, with really low price difference between the assets of a specific liquidity pool, the price provider can be simplified by calculating the **minimum price of the Curve token**, which allows to have a safe reference for liquiditions on the Aave protocol, not sacrifying too much precision for holders using the token as collateral to borrow against. The procedure implemented on the `latestAnswer()` function on the **CurvePriceProvider** contract is explained in a more detailed way in the following section.

## Calculation of price

On `latestAnswer()`, the price is defined as `curve_token_minimum_price = tokensMinPrice.mul(ICurve(getToken()).get_virtual_price()).div(1e18)`.

- `tokensMinPrice` is the lowest price of a token in the liquidity pool, denominated in wei per big unit of the token.

- `ICurve(getToken()).get_virtual_price()` is defined as `D / Nt`; where `D`, as explained on the Curve (StableSwap) whitepaper the summation of all the token balances of a pool that points to the objective price of the pool, in this case, the dollar reference price; and `Nt` is the total supply of Curve tokens of the liquidity pool.

- `.div(1e18)` is necessary to have the final units in wei, as the both previous components are in wei too.

More information about this calculation can be found [here](curve-minimum-token-price.pdf)

## Implementation

In order to optimize gas consumption, the implementation on `CurvePriceProviderHardcoded` will be the one deployed and connected with the existing Aave Oracle, "hardcoding" the corresponding addresses for each price provider deployed. There will be one price provider for each Curve liquidity token.
In order to test the price provider, there is also a `CurvePriceProvider` smart contract which contains exactly the same logic, but passing all the reference addresses on construction.

## Aave Protocol integration

The Curve liquidity tokens will be listed in the Aave Protocol in a new market and, for each token, there will be deployed one `CurvePriceProviderHardcoded` (one for Curve-Compound, one for Curve-Y, ...). This providers will be added to the [Aave Oracle](https://etherscan.io/address/0x76b47460d7f7c5222cfb6b6a75615ab10895dde4#readContract), which will be registered as price oracle in a new [LendingPoolAddressesProvider]() for the Curve market is deployed and added in Aave [LendingPoolAddressesProvider](https://github.com/aave/aave-protocol/blob/master/contracts/configuration/LendingPoolAddressesProvider.sol).
