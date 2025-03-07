import { Helper } from "../../utils";

import { Amount } from "../../../src/utils/Amount";

import { Client, Context, ContextBuilder } from "kios-sdk-client-v2";
import { NetWorkType } from "../../../src/types";
import { PaymentClient } from "../../../src/client/PaymentClient";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const shopInfo = Helper.loadShopInfo();
    const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    const context: Context = new Context(contextParams);
    const client = new Client(context);

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
        Helper.NETWORK === "kios_mainnet"
            ? NetWorkType.mainnet
            : Helper.NETWORK === "kios_testnet"
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
