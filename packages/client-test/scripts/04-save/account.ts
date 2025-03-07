import { Helper } from "../utils";
import { INewPurchaseData, INewPurchaseDetails, NetWorkType } from "../../src/types";
import { SavePurchaseClient } from "../../src/client/SavePurchaseClient";

import { CommonUtils } from "../../src/utils/CommonUtils";

const beautify = require("beautify");

let purchaseSequence = 0;
function getPurchaseId(): string {
    const res =
        "P" +
        new Date()
            .getTime()
            .toString()
            .padStart(10, "0") +
        purchaseSequence.toString().padStart(5, "0");
    purchaseSequence++;
    return res;
}

async function main() {
    const userInfo = Helper.loadUserInfo();
    const shopInfo = Helper.loadShopInfo();

    const makeTransactions = async (): Promise<INewPurchaseData> => {
        const purchaseId = getPurchaseId();
        const details: INewPurchaseDetails[] = [
            {
                productId: "2020051310000000",
                amount: 10_000,
                providePercent: 10,
            },
        ];
        let totalAmount: number = 0;
        for (const elem of details) {
            totalAmount += elem.amount;
        }
        const cashAmount = totalAmount;

        return {
            purchaseId,
            timestamp: CommonUtils.getTimeStampBigInt(),
            totalAmount,
            cashAmount,
            currency: process.env.CURRENCY || "krw",
            shopId: shopInfo.shopId,
            waiting: BigInt(0),
            userAccount: userInfo.wallet.address,
            userPhone: "",
            details,
        };
    };

    console.log("파라메타를 생성합니다.");
    const tx = await makeTransactions();
    console.log(tx);

    console.log("구매정보를 전달합니다.");
    const network: NetWorkType =
        Helper.NETWORK === "kios_mainnet"
            ? NetWorkType.mainnet
            : Helper.NETWORK === "kios_testnet"
            ? NetWorkType.testnet
            : NetWorkType.localhost;
    const savePurchaseClient = new SavePurchaseClient(network, Helper.SAVE_ACCESS_KEY, Helper.ASSET_ADDRESS);
    const response = await savePurchaseClient.saveNewPurchase(
        tx.purchaseId,
        BigInt(tx.timestamp),
        BigInt(tx.waiting),
        tx.totalAmount,
        tx.cashAmount,
        tx.currency,
        tx.shopId,
        tx.userAccount,
        tx.userPhone,
        tx.details
    );

    console.log("처리결과입니다.");
    console.log(response.code);
    console.log(beautify(JSON.stringify(response), { format: "json" }));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
