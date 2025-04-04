import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";
import { Helper } from "../utils";

const beautify = require("beautify");

async function main() {
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, Helper.TEST_PK);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    console.log(beautify(JSON.stringify(contextParam), { format: "json" }));

    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);

    console.log((await client.ledger.relay.getEndpoint("/")).toString());
    const relayStatus = await client.ledger.relay.isUp();
    console.log(`relayStatus: ${relayStatus}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
