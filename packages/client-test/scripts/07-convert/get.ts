import { Helper } from "../utils";
import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";
import { BOACoin } from "../../src/utils/Amount";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);
    const pointAmount = BOACoin.make("1");
    const tokenAmount = new BOACoin(await client.currency.pointToToken(pointAmount.value));
    console.log(`point amount : ${pointAmount.toDisplayString(true, 2)} POINT`);
    console.log(`token amount : ${tokenAmount.toDisplayString(true, 2)} TOKEN`);
    const amount1 = new BOACoin(await client.currency.pointToCurrency(pointAmount.value, "krw"));
    console.log(`currency amount : ${amount1.toDisplayString(true, 2)} KRW`);

    const symbols = ["point", "kios", "usd", "krw", "jpy", "cny", "php", "eur"];
    for (const symbol of symbols) {
        const rate = await client.currency.getRate(symbol);
        console.log(`${symbol.toUpperCase()} rate : ${rate.toString()}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
