import { Helper } from "../utils";
import { Client, Context, ContextBuilder, ContextParams, ContractUtils, NormalSteps } from "kios-sdk-client-v2";
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

    const receivers = [
        { address: "0xAfAF5a8e5c81F5E34Cb81F807783FFD102e1468A", amount: 10 },
        { address: "0x600D8D283720Cbf77eA2716De82A17C496040b73", amount: 10 },
        { address: "0x92bF3c13aB2a2b22145AD73288f9f0616b2f79fA", amount: 10 },
        { address: "0x269934dC26693aaE2550bf53bD194749B0cd5b2d", amount: 20 },
        { address: "0x9F0C5A10e9fB226B3C8Bc0b5294B9645393aFA42", amount: 20 },
        { address: "0x1285E0BC94E42ffaBa330Fc772df808Cbe031031", amount: 20 },
        { address: "0x218cC2Eb848dF760889Fc3CAE128022015c0F057", amount: 10 },
        { address: "0xd4e62B6692a2100c16012F7e5d70EB1329eD085a", amount: 10 },
        { address: "0x714c61A63Cf227dC9a2B451f22194C893bb732E5", amount: 10 },
        { address: "0x7ff989e428b71dffcb2bf1e32c9e0d5989c9da97", amount: 10 },
        { address: "0x737FbD1Ac7f9090173E7Bc328B4256Bb7F9A54FA", amount: 10 },
        { address: "0x51710733c048930aECbcC553Bfee7A61d082dB46", amount: 20 },
        { address: "0xFe7A7fE3c1c04aa5F4b3BdBD819e111987310dB7", amount: 10 },
        { address: "0x04fd8d48b13f988e3572a49214bd97abb777a742", amount: 10 },
        { address: "0xF173B77E00a059591C5c8DAa71E15fA757514509", amount: 10 },
        { address: "0x6b1f2Cd2f5Eb3CBDddb52EC3b30358ae17F049D8", amount: 20 },
        { address: "0x1a12c0ea53116ebf4F92F57f6fd8902a08022B21", amount: 20 },
        { address: "0xcDC750861B4963D707B107C23F841Ab78Aa02795", amount: 10 },
        { address: "0x949E288598Cc63dCe03A52c35f06ffCCBf7a47e6", amount: 10 },
        { address: "0xE5339bAb933F08e8DD20136F07389D2E4940a97c", amount: 10 },
        { address: "0x417DD6F62cDA5367a758274A30cc34288e563521", amount: 10 },
        { address: "0xeE699eED25CD9FbCc8A21Ee82A822190D7347d80", amount: 10 },
        { address: "0x3ff285456312B52468D7866f4852036e335847d1", amount: 10 },
        { address: "0x6594B4F8E6d0753455a998CBC4dF25a3057415fa", amount: 10 },
        { address: "0xCE6911e618436CC438b413150af57fbD8ff3a362", amount: 10 },
        { address: "0x8702EB47d2ff86E42A083C6bE1af8cbDa0196560", amount: 10 },
        { address: "0xF6b38f0B4b12F251780f64960B12Eb6f8D4832d1", amount: 10 },
        { address: "0xf4253F58f6A0afE6b5850Bb4E6ec9ead20F7Ce90", amount: 10 },
        { address: "0xBCfdaa84B6297A3826BA22c5F681782a4304E3cF", amount: 10 },
    ];

    console.log("Before");
    console.log(
        "Balance of Sender : ",
        new BOACoin(await client.ledger.getTokenBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );
    for (const receiver of receivers) {
        console.log(
            `Balance of Receiver (${receiver.address}) : `,
            new BOACoin(await client.ledger.getTokenBalance(receiver.address)).toDisplayString(true, 4)
        );
    }

    const fee = BOACoin.make(0.1).value;
    for (const receiver of receivers) {
        console.log(`Receiver: ${receiver.address}, ${receiver.amount}`);
        const amount = BOACoin.make(receiver.amount).value.add(fee);
        for await (const step of client.ledger.transfer(receiver.address, amount)) {
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
        await ContractUtils.delay(1000);
    }
    console.log("After");
    console.log(
        "Balance of Sender : ",
        new BOACoin(await client.ledger.getTokenBalance(userInfo.wallet.address)).toDisplayString(true, 4)
    );
    for (const receiver of receivers) {
        console.log(
            `Balance of Receiver (${receiver.address}) : `,
            new BOACoin(await client.ledger.getTokenBalance(receiver.address)).toDisplayString(true, 4)
        );
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
