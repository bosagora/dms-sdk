import { Helper } from "../../utils";

import { Client, Context, ContextBuilder, ContextParams, NormalSteps } from "kios-sdk-client-v2";

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
    const paymentId = Helper.getPaymentId();

    let detail = await client.ledger.getPaymentDetail(paymentId);

    // Approve New
    console.log("Approve Cancel");
    client.usePrivateKey(shopInfo.wallet.privateKey);
    for await (const step of client.ledger.approveCancelPayment(paymentId, detail.purchaseId, true)) {
        switch (step.key) {
            case NormalSteps.PREPARED:
                console.log("NormalSteps.PREPARED");
                break;
            case NormalSteps.SENT:
                console.log("NormalSteps.SENT");
                break;
            case NormalSteps.APPROVED:
                console.log("NormalSteps.APPROVED");
                break;
            default:
                throw new Error("Unexpected pay point step: " + JSON.stringify(step, null, 2));
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
