import { Helper } from "../../utils";

import { Amount } from "../../../src/utils/Amount";

import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";
import { NetWorkType } from "../../../src/types";
import { PaymentClient } from "../../../src/client/PaymentClient";

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

    const purchase = {
        purchaseId: Helper.getPurchaseId(),
        timestamp: 1672844400,
        amount: 100,
        method: 0,
        currency: "krw",
        shopIndex: 0,
        userIndex: 0,
    };
    const amount = Amount.make(purchase.amount, 18);

    // Create temporary account
    console.log("Create temporary account");
    const temporaryAccount = await client.ledger.getTemporaryAccount();
    console.log(`temporaryAccount: ${temporaryAccount}`);

    const network: NetWorkType =
        Helper.NETWORK === "main_group"
            ? NetWorkType.mainnet
            : Helper.NETWORK === "test_group"
            ? NetWorkType.testnet
            : NetWorkType.localhost;
    const paymentClient = new PaymentClient(network, Helper.RELAY_ACCESS_KEY);

    // Open New
    console.log("Open New");
    const result = await paymentClient.openNewPayment(
        purchase.purchaseId,
        temporaryAccount,
        amount.value,
        purchase.currency,
        shopInfo.shopId,
        ""
    );

    // @ts-ignore
    const paymentId = result.paymentId;
    Helper.setPaymentId(paymentId);
    console.log(`paymentId: ${paymentId}`);
    console.log(`account: ${result.account}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
