import { Helper } from "../utils";
import { BOACoin } from "../../src/utils/Amount";
import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);

    const info = await client.ledger.getSystemInfo();
    console.log(`- tokenInfo`);
    console.log(`   - symbol: ${info.token.symbol}`);
    console.log(`- pointInfo`);
    console.log(`   - precision: ${info.point.precision}`);
    console.log(`   - equivalent currency: ${info.point.equivalentCurrency}`);
    console.log(`- language: ${info.language}`);
    console.log(`- support`);
    console.log(`       - loyalty bridge: ${info.support.loyaltyBridge}`);
    console.log(`       - exchange: ${info.support.exchange}`);
    console.log(`       - inner chain bridge: ${info.support.innerChainBridge}`);
    console.log(`       - outer chain bridge: ${info.support.outerChainBridge}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
