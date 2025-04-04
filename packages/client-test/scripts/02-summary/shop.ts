import { Helper } from "../utils";
import { BOACoin } from "../../src/utils/Amount";
import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";

async function main() {
    const shopInfo = Helper.loadShopInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, shopInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);

    const summary = await client.shop.getSummary(shopInfo.shopId);
    console.log(`- shopInfo:`);
    console.log(`   - shopId: ${summary.shopInfo.shopId}`);
    console.log(`   - name: ${summary.shopInfo.name}`);
    console.log(`   - currency: ${summary.shopInfo.currency}`);
    console.log(`   - status: ${summary.shopInfo.status}`);
    console.log(`   - account: ${summary.shopInfo.account}`);
    console.log(`   - delegator: ${summary.shopInfo.delegator}`);
    console.log(`   - providedAmount: ${new BOACoin(summary.shopInfo.providedAmount).toDisplayString(true, 4)}`);
    console.log(`   - usedAmount: ${new BOACoin(summary.shopInfo.usedAmount).toDisplayString(true, 4)}`);
    console.log(`   - collectedAmount: ${new BOACoin(summary.shopInfo.collectedAmount).toDisplayString(true, 4)}`);
    console.log(`   - refundedAmount: ${new BOACoin(summary.shopInfo.refundedAmount).toDisplayString(true, 4)}`);
    console.log(`   - refundableAmount: ${new BOACoin(summary.shopInfo.refundableAmount).toDisplayString(true, 4)}`);
    console.log(`   - refundableToken: ${new BOACoin(summary.shopInfo.refundableToken).toDisplayString(true, 4)}`);
    console.log(`- tokenInfo`);
    console.log(`   - symbol: ${summary.tokenInfo.symbol}`);
    console.log(`   - name: ${summary.tokenInfo.name}`);
    console.log(`   - decimals: ${summary.tokenInfo.decimals}`);

    console.log(`- exchangeRate`);
    console.log(`   - token:`);
    console.log(`       - symbol: ${summary.exchangeRate.token.symbol}`);
    console.log(`       - value: ${new BOACoin(summary.exchangeRate.token.value).toDisplayString(true, 4)}`);
    console.log(`   - currency:`);
    console.log(`       - symbol: ${summary.exchangeRate.currency.symbol}`);
    console.log(`       - value: ${new BOACoin(summary.exchangeRate.currency.value).toDisplayString(true, 4)}`);

    console.log(`- settlement`);
    console.log(`   - manager: ${summary.settlement.manager}`);

    console.log(`- agent`);
    console.log(`   - provision: ${summary.agent.provision}`);
    console.log(`   - refund: ${summary.agent.refund}`);
    console.log(`   - withdrawal: ${summary.agent.withdrawal}`);

    console.log(`- ledger`);
    console.log(`   - point.balance: ${new BOACoin(summary.ledger.point.balance).toDisplayString(true, 4)}`);
    console.log(`   - point.value: ${new BOACoin(summary.ledger.point.value).toDisplayString(true, 4)}`);
    console.log(`   - token.balance: ${new BOACoin(summary.ledger.token.balance).toDisplayString(true, 4)}`);
    console.log(`   - token.value: ${new BOACoin(summary.ledger.token.value).toDisplayString(true, 4)}`);

    console.log(`- outerChain`);
    console.log(`   - point.balance: ${new BOACoin(summary.outerChain.point.balance).toDisplayString(true, 4)}`);
    console.log(`   - point.value: ${new BOACoin(summary.outerChain.point.value).toDisplayString(true, 4)}`);
    console.log(`   - token.balance: ${new BOACoin(summary.outerChain.token.balance).toDisplayString(true, 4)}`);
    console.log(`   - token.value: ${new BOACoin(summary.outerChain.token.value).toDisplayString(true, 4)}`);
    console.log(`   - native.balance: ${new BOACoin(summary.outerChain.native.balance).toDisplayString(true, 4)}`);
    console.log(`   - native.symbol: ${summary.outerChain.native.symbol}`);

    console.log(`- mainChain`);
    console.log(`   - point.balance: ${new BOACoin(summary.mainChain.point.balance).toDisplayString(true, 4)}`);
    console.log(`   - point.value: ${new BOACoin(summary.mainChain.point.value).toDisplayString(true, 4)}`);
    console.log(`   - token.balance: ${new BOACoin(summary.mainChain.token.balance).toDisplayString(true, 4)}`);
    console.log(`   - token.value: ${new BOACoin(summary.mainChain.token.value).toDisplayString(true, 4)}`);
    console.log(`   - native.balance: ${new BOACoin(summary.mainChain.native.balance).toDisplayString(true, 4)}`);
    console.log(`   - native.symbol: ${summary.mainChain.native.symbol}`);

    console.log(`- sideChain`);
    console.log(`   - point.balance: ${new BOACoin(summary.sideChain.point.balance).toDisplayString(true, 4)}`);
    console.log(`   - point.value: ${new BOACoin(summary.sideChain.point.value).toDisplayString(true, 4)}`);
    console.log(`   - token.balance: ${new BOACoin(summary.sideChain.token.balance).toDisplayString(true, 4)}`);
    console.log(`   - token.value: ${new BOACoin(summary.sideChain.token.value).toDisplayString(true, 4)}`);
    console.log(`   - native.balance: ${new BOACoin(summary.sideChain.native.balance).toDisplayString(true, 4)}`);
    console.log(`   - native.symbol: ${summary.sideChain.native.symbol}`);

    console.log(`- protocolFees`);
    console.log(
        `   - transferInMainNet: ${new BOACoin(summary.protocolFees.transferInMainNet).toDisplayString(true, 4)}`
    );
    console.log(
        `   - withdrawToMainNet: ${new BOACoin(summary.protocolFees.withdrawToMainNet).toDisplayString(true, 4)}`
    );
    console.log(
        `   - depositFromMainNet: ${new BOACoin(summary.protocolFees.depositFromMainNet).toDisplayString(true, 4)}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
