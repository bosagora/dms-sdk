import { Helper } from "../utils";
import {
    Amount,
    Client,
    Context,
    ContextBuilder,
    ContextParams,
    NormalSteps,
    WaiteBridgeSteps,
} from "kios-sdk-client-v2";
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

    const receiver = "0x3FE8D00143bd0eAd2397D48ba0E31E5E1268dBfb";

    console.log("Before");
    console.log(
        "Balance of Ledger     : ",
        new BOACoin(await client.ledger.getBalanceOfOuterChainToken(userInfo.wallet.address)).toDisplayString(true, 4)
    );
    console.log(
        "Balance of Ledger     : ",
        new BOACoin(await client.ledger.getBalanceOfOuterChainToken(receiver)).toDisplayString(true, 4)
    );

    const amount = BOACoin.make(100).value;
    for await (const step of client.ledger.transferInOuterChain(receiver, amount)) {
        switch (step.key) {
            case NormalSteps.PREPARED:
                console.log(`NormalSteps.PREPARED`);
                break;
            case NormalSteps.SENT:
                console.log(`NormalSteps.SENT`);
                break;
            case NormalSteps.DONE:
                console.log(`NormalSteps.DONE`);
                console.log(`from: ${step.from}`);
                console.log(`to: ${step.to}`);
                console.log(`amount: ${new BOACoin(step.amount).toDisplayString(true, 4)}`);
                break;
            default:
                throw new Error("Unexpected bridge step: " + JSON.stringify(step, null, 2));
        }
    }
    console.log("After");
    console.log(
        "Balance of Ledger     : ",
        new BOACoin(await client.ledger.getBalanceOfOuterChainToken(userInfo.wallet.address)).toDisplayString(true, 4)
    );
    console.log(
        "Balance of Ledger     : ",
        new BOACoin(await client.ledger.getBalanceOfOuterChainToken(receiver)).toDisplayString(true, 4)
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
