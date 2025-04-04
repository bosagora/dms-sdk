import { Helper } from "../utils";
import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";
import { Ledger, Ledger__factory } from "kios-contracts-lib-v2";
import { Wallet } from "ethers";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);

    const contractOwner = new Wallet(process.env.CONTRACT_OWNER || "", client.web3.getProvider());
    const ledgerContract: Ledger = Ledger__factory.connect(client.web3.getLedgerAddress(), contractOwner);
    await ledgerContract.unregisterProvider(userInfo.wallet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
