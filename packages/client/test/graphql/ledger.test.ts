import { contextParamsDevnet } from "../helper/constants";
import { Amount, Client, Context, ContractUtils, LIVE_CONTRACTS, PayPointSteps, PayTokenSteps } from "../../src";
import { BigNumber } from "@ethersproject/bignumber";
import { Wallet } from "@ethersproject/wallet";

// @ts-ignore
import fs from "fs";

export interface IPurchaseData {
    purchaseId: string;
    timestamp: number;
    amount: number;
    method: number;
    currency: string;
    userIndex: number;
    shopIndex: number;
}

interface IUserData {
    idx: number;
    phone: string;
    address: string;
    privateKey: string;
    royaltyType: number;
}

export interface IShopData {
    shopId: string;
    name: string;
    provideWaitTime: number;
    providePercent: number;
    address: string;
    privateKey: string;
}

describe("Integrated test", () => {
    describe("Save Purchase Data & Pay (point, token)", () => {
        describe("Method Check", () => {
            let client: Client;
            const users: IUserData[] = JSON.parse(fs.readFileSync("test/helper/users.json", "utf8"));
            const shops: IShopData[] = JSON.parse(fs.readFileSync("test/helper/shops.json", "utf8"));
            beforeAll(async () => {
                contextParamsDevnet.tokenAddress = LIVE_CONTRACTS["bosagora_devnet"].TokenAddress;
                contextParamsDevnet.phoneLinkCollectionAddress =
                    LIVE_CONTRACTS["bosagora_devnet"].PhoneLinkCollectionAddress;
                contextParamsDevnet.validatorCollectionAddress =
                    LIVE_CONTRACTS["bosagora_devnet"].ValidatorCollectionAddress;
                contextParamsDevnet.currencyRateAddress = LIVE_CONTRACTS["bosagora_devnet"].CurrencyRateAddress;
                contextParamsDevnet.shopCollectionAddress = LIVE_CONTRACTS["bosagora_devnet"].ShopCollectionAddress;
                contextParamsDevnet.ledgerAddress = LIVE_CONTRACTS["bosagora_devnet"].LedgerAddress;
                contextParamsDevnet.signer = new Wallet(users[50].privateKey);
                const ctx = new Context(contextParamsDevnet);
                client = new Client(ctx);
            });

            it("Web3 Health Checking", async () => {
                const isUp = await client.ledger.web3.isUp();
                expect(isUp).toEqual(true);
            });

            it("Server Health Checking", async () => {
                const isUp = await client.ledger.isRelayUp();
                expect(isUp).toEqual(true);
            });

            describe("GraphQL TEST", () => {
                it("GraphQL Server Health Test", async () => {
                    const web3IsUp = await client.web3.isUp();
                    expect(web3IsUp).toEqual(true);
                    await ContractUtils.delay(1000);
                    const isUp: boolean = await client.graphql.isUp();
                    await ContractUtils.delay(1000);
                    expect(isUp).toEqual(true);
                });

                it("All History", async () => {
                    const user = users[50];
                    const res = await client.ledger.getUserTradeHistory(user.address);
                    const length = res.userTradeHistories.length;
                    expect(length).toBeGreaterThan(0);
                    expect(res.userTradeHistories[length - 1].account.toUpperCase()).toEqual(
                        user.address.toUpperCase()
                    );
                });

                it("Point Input History", async () => {
                    for (const user of users) {
                        if (user.royaltyType === 0) {
                            const res = await client.ledger.getUserPointInputTradeHistory(user.address);
                            const length = res.userTradeHistories.length;
                            if (length > 0) {
                                expect(res.userTradeHistories[length - 1].account.toUpperCase()).toEqual(
                                    user.address.toUpperCase()
                                );
                                expect(res.userTradeHistories[length - 1].assetFlow).toEqual("PointInput");
                            }
                        }
                    }
                });

                it("Token Input History", async () => {
                    for (const user of users) {
                        if (user.royaltyType === 1) {
                            const res = await client.ledger.getUserTokenInputTradeHistory(user.address);
                            const length = res.userTradeHistories.length;
                            if (length > 0) {
                                expect(res.userTradeHistories[length - 1].account.toUpperCase()).toEqual(
                                    user.address.toUpperCase()
                                );
                                expect(res.userTradeHistories[length - 1].assetFlow).toEqual("TokenInput");
                            }
                        }
                    }
                });

                it("Point Output History", async () => {
                    for (const user of users) {
                        if (user.royaltyType === 0) {
                            const res = await client.ledger.getUserPointOutputTradeHistory(user.address);
                            const length = res.userTradeHistories.length;
                            if (length > 0) {
                                expect(res.userTradeHistories[length - 1].account.toUpperCase()).toEqual(
                                    user.address.toUpperCase()
                                );
                                expect(res.userTradeHistories[length - 1].assetFlow).toEqual("PointOutput");
                            }
                        }
                    }
                });

                it("Token Output History", async () => {
                    for (const user of users) {
                        if (user.royaltyType === 1) {
                            const res = await client.ledger.getUserTokenOutputTradeHistory(user.address);
                            const length = res.userTradeHistories.length;
                            if (length > 0) {
                                expect(res.userTradeHistories[length - 1].account.toUpperCase()).toEqual(
                                    user.address.toUpperCase()
                                );
                                expect(res.userTradeHistories[length - 1].assetFlow).toEqual("TokenOutput");
                            }
                        }
                    }
                });

                it("Pay token", async () => {
                    const purchase: IPurchaseData = {
                        purchaseId: "P100000",
                        timestamp: 1672844400,
                        amount: 1,
                        currency: "krw",
                        shopIndex: 0,
                        userIndex: 50,
                        method: 0
                    };

                    const multiple = BigNumber.from(1_000_000_000);
                    const price = BigNumber.from(150).mul(multiple);
                    const amount = Amount.make(purchase.amount * 10, 18).value;
                    const tokenAmount = amount.mul(multiple).div(price);
                    let userIndex = 0;
                    for (const user of users) {
                        const balance = await client.ledger.getTokenBalance(user.address);
                        if (balance.gt(tokenAmount)) {
                            break;
                        }
                        userIndex++;
                    }

                    purchase.userIndex = userIndex;
                    purchase.purchaseId = `P${ContractUtils.getTimeStamp()}`;

                    // Change Signer
                    contextParamsDevnet.signer = new Wallet(users[purchase.userIndex]);
                    const ctx = new Context(contextParamsDevnet);
                    client = new Client(ctx);

                    await ContractUtils.delay(2000);

                    for await (const step of client.ledger.payToken(
                        purchase.purchaseId,
                        amount,
                        purchase.currency,
                        shops[purchase.shopIndex].shopId
                    )) {
                        switch (step.key) {
                            case PayTokenSteps.PREPARED:
                                expect(step.purchaseId).toEqual(purchase.purchaseId);
                                expect(step.amount).toEqual(amount);
                                expect(step.currency).toEqual(purchase.currency.toLowerCase());
                                expect(step.shopId).toEqual(shops[purchase.shopIndex].shopId);
                                expect(step.account.toUpperCase()).toEqual(users[userIndex].address.toUpperCase());
                                expect(step.signature).toMatch(/^0x[A-Fa-f0-9]{130}$/i);
                                break;
                            case PayTokenSteps.SENT:
                                expect(typeof step.txHash).toBe("string");
                                expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                                expect(step.purchaseId).toEqual(purchase.purchaseId);
                                break;
                            case PayTokenSteps.DONE:
                                expect(step.purchaseId).toEqual(purchase.purchaseId);
                                expect(step.paidValue).toEqual(amount);
                                break;
                            default:
                                throw new Error("Unexpected pay token step: " + JSON.stringify(step, null, 2));
                        }
                    }

                    const res = await client.ledger.getPaidToken(users[userIndex].address, purchase.purchaseId);
                    if (res.length == 1) {
                        expect(res.paidToken[0].account.toUpperCase()).toEqual(users[userIndex].address.toUpperCase());
                        expect(res.paidToken[0].purchaseId).toEqual(purchase.purchaseId);
                    }
                });

                it("Pay point", async () => {
                    const purchase: IPurchaseData = {
                        purchaseId: "P100000",
                        timestamp: 1672844400,
                        amount: 1,
                        currency: "krw",
                        shopIndex: 0,
                        userIndex: 0,
                        method: 0
                    };

                    const amount = Amount.make(purchase.amount * 10, 18).value;
                    let userIndex = 0;
                    for (const user of users) {
                        const balance = await client.ledger.getPointBalance(user.address);
                        if (balance.gt(amount)) {
                            break;
                        }
                        userIndex++;
                    }

                    purchase.userIndex = userIndex;
                    purchase.purchaseId = `P${ContractUtils.getTimeStamp()}`;

                    // Change Signer
                    contextParamsDevnet.signer = new Wallet(users[purchase.userIndex]);
                    const ctx = new Context(contextParamsDevnet);
                    client = new Client(ctx);

                    await ContractUtils.delay(2000);

                    for await (const step of client.ledger.payPoint(
                        purchase.purchaseId,
                        amount,
                        purchase.currency,
                        shops[purchase.shopIndex].shopId
                    )) {
                        switch (step.key) {
                            case PayPointSteps.PREPARED:
                                expect(step.purchaseId).toEqual(purchase.purchaseId);
                                expect(step.amount).toEqual(amount);
                                expect(step.currency).toEqual(purchase.currency.toLowerCase());
                                expect(step.shopId).toEqual(shops[purchase.shopIndex].shopId);
                                expect(step.account.toUpperCase()).toEqual(users[userIndex].address.toUpperCase());
                                expect(step.signature).toMatch(/^0x[A-Fa-f0-9]{130}$/i);
                                break;
                            case PayPointSteps.SENT:
                                expect(typeof step.txHash).toBe("string");
                                expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                                expect(step.purchaseId).toEqual(purchase.purchaseId);
                                break;
                            case PayPointSteps.DONE:
                                expect(step.purchaseId).toEqual(purchase.purchaseId);
                                expect(step.paidValue).toEqual(amount);
                                break;
                            default:
                                throw new Error("Unexpected pay point step: " + JSON.stringify(step, null, 2));
                        }
                    }

                    const res = await client.ledger.getPaidPoint(users[userIndex].address, purchase.purchaseId);
                    if (res.length == 1) {
                        expect(res.paidPoint[0].account.toUpperCase()).toEqual(users[userIndex].address.toUpperCase());
                        expect(res.paidPoint[0].purchaseId).toEqual(purchase.purchaseId);
                    }
                });
            });
        });
    });
});