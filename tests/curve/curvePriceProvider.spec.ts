import { TestEnv, makeSuite } from './helpers/make-suite';
import { TEST_PLATFORM_ID, TEST_SUBTOKENS } from '../../scripts/curve/constants';
import { expect } from 'chai';

makeSuite('CurvePriceProvider', (testEnv: TestEnv) => {
  it('Correct configuration on price provider', async () => {
    const { curvePriceProvider, aaveOracle, curveToken } = testEnv;

    expect((await curvePriceProvider.getPlatformId()).toString()).to.be.equal(
      TEST_PLATFORM_ID.toString()
    );

    expect(await curvePriceProvider.getSubTokens()).to.deep.eq(TEST_SUBTOKENS);
    expect(await curvePriceProvider.getAaveOracle()).to.eq(aaveOracle.address);
    expect(await curvePriceProvider.getToken()).to.eq(curveToken.address);
  });

  it('Correct latest answer', async () => {
    const { curvePriceProvider } = testEnv;

    expect((await curvePriceProvider.latestAnswer()).toString()).to.be.equal('3030702005154151');
  });
});
