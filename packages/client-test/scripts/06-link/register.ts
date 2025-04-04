import { Helper } from "../utils";
import {
    Client,
    Context,
    ContextBuilder,
    ContextParams,
    ContractUtils,
    PhoneLinkRegisterSteps,
    PhoneLinkSubmitSteps,
} from "kios-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);
    let requestId = "";
    for await (const step of client.link.register(userInfo.phone)) {
        switch (step.key) {
            case PhoneLinkRegisterSteps.SENDING:
                console.log("PhoneLinkRegisterSteps.SENDING");
                requestId = step.requestId.toString();
                break;
            case PhoneLinkRegisterSteps.REQUESTED:
                console.log("PhoneLinkRegisterSteps.REQUESTED");
                break;
            default:
                throw new Error("Unexpected step: " + JSON.stringify(step, null, 2));
        }
    }

    await ContractUtils.delay(3000);

    for await (const step of client.link.submit(requestId, "000102")) {
        switch (step.key) {
            case PhoneLinkSubmitSteps.SENDING:
                console.log("PhoneLinkSubmitSteps.SENDING");
                break;
            case PhoneLinkSubmitSteps.ACCEPTED:
                console.log("PhoneLinkSubmitSteps.ACCEPTED");
                break;
            default:
                throw new Error("Unexpected step: " + JSON.stringify(step, null, 2));
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
