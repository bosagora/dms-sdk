import { Helper } from "../utils";

import { Client, Context, ContextBuilder, ContextParams, MobileType } from "kios-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const shopInfo = Helper.loadShopInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);

    console.log("User App");
    const exists1 = await client.ledger.isExistsMobileAccountToken(userInfo.token, MobileType.USER_APP);
    console.log(`exists: ${exists1}`);

    console.log("Shop App");
    client.usePrivateKey(shopInfo.wallet.privateKey);
    const exists2 = await client.ledger.isExistsMobileAccountToken(shopInfo.token, MobileType.SHOP_APP);
    console.log(`exists: ${exists2}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
