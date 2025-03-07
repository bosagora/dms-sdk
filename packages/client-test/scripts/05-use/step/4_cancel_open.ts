import { Helper } from "../../utils";

import { ContextBuilder } from "kios-sdk-client-v2";
import { NetWorkType } from "../../../src/types";
import { PaymentClient } from "../../../src/client/PaymentClient";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;

    const paymentId = Helper.getPaymentId();

    const network: NetWorkType =
        Helper.NETWORK === "kios_mainnet"
            ? NetWorkType.mainnet
            : Helper.NETWORK === "kios_testnet"
            ? NetWorkType.testnet
            : NetWorkType.localhost;
    const paymentClient = new PaymentClient(network, Helper.RELAY_ACCESS_KEY);

    // Open New
    console.log("Open Cancel");
    const result = await paymentClient.openCancelPayment(paymentId, "");
    console.log(`paymentId: ${result.paymentId}`);
    console.log(`account: ${result.account}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
