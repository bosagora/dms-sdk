import { Helper } from "../utils";
import { BOACoin } from "../../src/utils/Amount";
import { Client, Context, ContextBuilder, ContextParams } from "kios-sdk-client-v2";
import { BigNumber } from "@ethersproject/bignumber";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParam: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParam.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT_SIDE !== "") contextParam.side.web3Provider = Helper.WEB3_ENDPOINT_SIDE;
    if (Helper.WEB3_ENDPOINT_MAIN !== "") contextParam.main.web3Provider = Helper.WEB3_ENDPOINT_MAIN;
    if (Helper.WEB3_ENDPOINT_OUTER !== "") contextParam.outer.web3Provider = Helper.WEB3_ENDPOINT_OUTER;
    const ctx: Context = new Context(contextParam);
    const client = new Client(ctx);

    const info = await client.ledger.getChainInfoOfSideChain();
    console.log(`- url: ${info.url}`);
    console.log(`- network:`);
    console.log(`   - name: ${info.network.name}`);
    console.log(`   - chainId: ${info.network.chainId}`);
    console.log(`   - ensAddress: ${info.network.ensAddress}`);
    console.log(`   - chainTransferFee: ${new BOACoin(info.network.chainTransferFee).toDisplayString(true, 4)}`);
    console.log(`   - loyaltyTransferFee: ${new BOACoin(info.network.loyaltyTransferFee).toDisplayString(true, 4)}`);
    console.log(`   - loyaltyBridgeFee: ${new BOACoin(info.network.loyaltyBridgeFee).toDisplayString(true, 4)}`);
    console.log(`   - innerChainBridgeFee: ${new BOACoin(info.network.innerChainBridgeFee).toDisplayString(true, 4)}`);
    console.log(`   - outerChainBridgeFee: ${new BOACoin(info.network.outerChainBridgeFee).toDisplayString(true, 4)}`);
    console.log(`- contract:`);
    console.log(`   - token: ${info.contract.token}`);
    console.log(`   - loyaltyBridge: ${info.contract.loyaltyBridge}`);
    console.log(`   - innerChainBridge: ${info.contract.innerChainBridge}`);
    console.log(`   - outerChainBridge: ${info.contract.outerChainBridge}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
