import { Helper } from "../../utils";

import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";
import { NetWorkType } from "../../../src/types";
import { PaymentClient } from "../../../src/client/PaymentClient";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);
    const paymentId = Helper.getPaymentId();

    const network: NetWorkType =
        Helper.NETWORK === "main_group"
            ? NetWorkType.mainnet
            : Helper.NETWORK === "test_group"
            ? NetWorkType.testnet
            : NetWorkType.localhost;
    const paymentClient = new PaymentClient(network, Helper.RELAY_ACCESS_KEY);

    // Close Cancel
    console.log("Close Cancel");
    const result = await paymentClient.closeCancelPayment(paymentId, true);
    console.log(`paymentId: ${result.paymentId}`);
    console.log(`account: ${result.account}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
