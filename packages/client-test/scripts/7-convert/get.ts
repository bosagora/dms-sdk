import { Helper } from "../utils";
import { Client, Context, ContextBuilder } from "dms-sdk-client-v2";
import { BOACoin } from "../../src/Amount";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const context: Context = ContextBuilder.buildContext(Helper.NETWORK, userInfo.wallet.privateKey);
    const client = new Client(context);

    const pointAmount = BOACoin.make("1");
    const tokenAmount = new BOACoin(await client.currency.pointToToken(pointAmount.value));
    console.log(`point amount : ${pointAmount.toDisplayString(true, 2)} POINT`);
    console.log(`token amount : ${tokenAmount.toDisplayString(true, 2)} TOKEN`);
    const amount1 = new BOACoin(await client.currency.pointToCurrency(pointAmount.value, "krw"));
    console.log(`currency amount : ${amount1.toDisplayString(true, 2)} KRW`);

    const symbols = ["point", "acc", "usd", "krw", "jpy", "cny", "php", "eur"];
    for (const symbol of symbols) {
        const rate = await client.currency.getRate(symbol);
        console.log(`${symbol.toUpperCase()} rate : ${rate.toString()}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
