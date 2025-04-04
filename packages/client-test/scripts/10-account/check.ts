import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";
import { Helper } from "../utils";

const beautify = require("beautify");

import { Wallet } from "@ethersproject/wallet";

async function main() {
    const initialWallet = Wallet.createRandom();

    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, initialWallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);

    console.log("Wallet", initialWallet.address);
    console.log("Link", await client.link.getAccount());
    console.log("Currency", await client.currency.getAccount());
    console.log("Ledger", await client.ledger.getAccount());
    console.log("Shop", await client.shop.getAccount());
    console.log("--------");

    for (let idx = 0; idx < 10; idx++) {
        const wallet = Wallet.createRandom();
        client.usePrivateKey(wallet.privateKey);

        console.log("Wallet", wallet.address);
        console.log("Link", await client.link.getAccount());
        console.log("Currency", await client.currency.getAccount());
        console.log("Ledger", await client.ledger.getAccount());
        console.log("Shop", await client.shop.getAccount());

        if (wallet.address !== (await client.link.getAccount())) {
            console.error("Not match account of Link");
        }
        if (wallet.address !== (await client.currency.getAccount())) {
            console.error("Not match account of Currency");
        }
        if (wallet.address !== (await client.ledger.getAccount())) {
            console.error("Not match account of Ledger");
        }
        if (wallet.address !== (await client.shop.getAccount())) {
            console.error("Not match account of Shop");
        }
        console.log("--------");
        await Helper.delay(1000);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
