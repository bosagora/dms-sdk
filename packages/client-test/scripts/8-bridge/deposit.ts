import { Helper } from "../utils";
import { Amount, Client, Context, ContextBuilder, NormalSteps, WaiteBridgeSteps } from "dms-sdk-client-v2";
import { BOACoin } from "../../src/Amount";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const context: Context = ContextBuilder.buildContext(Helper.NETWORK, userInfo.wallet.privateKey);
    const client = new Client(context);

    console.log("Before");
    console.log(
        "Balance of Main Chain : ",
        new BOACoin(await client.ledger.getMainChainBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );
    console.log(
        "Balance of Ledger     : ",
        new BOACoin(await client.ledger.getTokenBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );

    const amount = Amount.make(100, 18).value;
    let depositId: string = "";
    for await (const step of client.ledger.depositViaBridge(amount)) {
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
            default:
                throw new Error("Unexpected bridge step: " + JSON.stringify(step, null, 2));
        }
    }

    for await (const step of client.ledger.waiteDepositViaBridge(depositId, 60)) {
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
        "Balance of Main Chain : ",
        new BOACoin(await client.ledger.getMainChainBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );
    console.log(
        "Balance of Ledger     : ",
        new BOACoin(await client.ledger.getTokenBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
