import { Helper } from "../../utils";
import {
    Amount,
    Client,
    Context,
    ContextBuilder,
    ContextParams,
    DepositSteps,
    NormalSteps,
    WaiteBridgeSteps,
} from "kios-sdk-client-v2";
import { BOACoin } from "../../../src/utils/Amount";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;

    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);
    console.log("Before");
    console.log(
        "Balance of Outer Chain : ",
        new BOACoin(await client.ledger.getOuterChainBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );
    console.log(
        "Balance of Main Chain : ",
        new BOACoin(await client.ledger.getMainChainBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );

    const amount = Amount.make(100, 18).value;
    let depositId: string = "";
    for await (const step of client.ledger.depositFromOuterChainToMainChainViaBridge(amount)) {
        switch (step.key) {
            case NormalSteps.PREPARED:
                console.log(`NormalSteps.PREPARED`);
                break;
            case NormalSteps.SENT:
                console.log(`NormalSteps.SENT`);
                break;
            case NormalSteps.DONE:
                console.log(`NormalSteps.DONE`);
                console.log(`depositId: ${step.depositId}`);
                depositId = step.depositId;
                break;
            case DepositSteps.CHECKED_ALLOWANCE:
                console.log(`DepositSteps.CHECKED_ALLOWANCE`);
                break;
            case DepositSteps.UPDATING_ALLOWANCE:
                console.log(`DepositSteps.UPDATING_ALLOWANCE`);
                break;
            case DepositSteps.UPDATED_ALLOWANCE:
                console.log(`DepositSteps.UPDATED_ALLOWANCE`);
                break;
            default:
                throw new Error("Unexpected bridge step: " + JSON.stringify(step, null, 2));
        }
    }

    for await (const step of client.ledger.waiteDepositFromOuterChainToMainChainViaBridge(depositId, 60)) {
        switch (step.key) {
            case WaiteBridgeSteps.CREATED:
                console.log("WaiteBridgeSteps.CREATED");
                break;
            case WaiteBridgeSteps.EXECUTED:
                console.log("WaiteBridgeSteps.EXECUTED");
                break;
            case WaiteBridgeSteps.DONE:
                console.log("WaiteBridgeSteps.DONE");
                break;
            default:
                throw new Error("Unexpected watch bridge step: " + JSON.stringify(step, null, 2));
        }
    }

    console.log("After");
    console.log(
        "Balance of Outer Chain : ",
        new BOACoin(await client.ledger.getOuterChainBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );
    console.log(
        "Balance of Main Chain : ",
        new BOACoin(await client.ledger.getMainChainBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
