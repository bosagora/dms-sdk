import { Network } from "../../src/client-common/interfaces/network";
import { AccountIndex, NodeInfo } from "../helper/NodeInfo";
import { Amount, Client, Context, ContractUtils, NormalSteps, LoyaltyNetworkID } from "../../src";

import { IShopData, IUserData, IPurchaseData } from "../helper/types";

import * as assert from "assert";

import { Wallet } from "@ethersproject/wallet";

describe("Shop Withdrawal", () => {
    const contextParams = NodeInfo.getContextParams();
    const contractInfo = NodeInfo.getContractInfo();
    const accounts = NodeInfo.accounts();
    const validatorWallets = [
        accounts[AccountIndex.VALIDATOR01],
        accounts[AccountIndex.VALIDATOR02],
        accounts[AccountIndex.VALIDATOR03],
        accounts[AccountIndex.VALIDATOR04],
        accounts[AccountIndex.VALIDATOR05],
        accounts[AccountIndex.VALIDATOR06],
        accounts[AccountIndex.VALIDATOR07],
        accounts[AccountIndex.VALIDATOR08],
        accounts[AccountIndex.VALIDATOR09],
        accounts[AccountIndex.VALIDATOR10],
        accounts[AccountIndex.VALIDATOR11],
        accounts[AccountIndex.VALIDATOR12],
        accounts[AccountIndex.VALIDATOR13],
        accounts[AccountIndex.VALIDATOR14],
        accounts[AccountIndex.VALIDATOR15],
        accounts[AccountIndex.VALIDATOR16]
    ];
    const userWallets = [
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom()
    ];
    const shopWallets = [
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom()
    ];

    const userData: IUserData[] = [
        {
            phone: "08201012341001",
            address: userWallets[0].address,
            privateKey: userWallets[0].privateKey
        },
        {
            phone: "08201012341002",
            address: userWallets[1].address,
            privateKey: userWallets[1].privateKey
        },
        {
            phone: "08201012341003",
            address: userWallets[2].address,
            privateKey: userWallets[2].privateKey
        },
        {
            phone: "08201012341004",
            address: userWallets[3].address,
            privateKey: userWallets[3].privateKey
        },
        {
            phone: "08201012341005",
            address: userWallets[4].address,
            privateKey: userWallets[4].privateKey
        }
    ];
    const shopData: IShopData[] = [
        {
            shopId: "",
            name: "Shop1",
            currency: "php",
            wallet: shopWallets[0]
        },
        {
            shopId: "",
            name: "Shop2",
            currency: "php",
            wallet: shopWallets[1]
        },
        {
            shopId: "",
            name: "Shop3",
            currency: "php",
            wallet: shopWallets[2]
        },
        {
            shopId: "",
            name: "Shop4",
            currency: "php",
            wallet: shopWallets[3]
        },
        {
            shopId: "",
            name: "Shop5",
            currency: "php",
            wallet: shopWallets[4]
        }
    ];
    const purchaseData: IPurchaseData[] = [
        {
            purchaseId: "P000001",
            timestamp: 1672844400,
            amount: 10000,
            method: 0,
            currency: "php",
            shopIndex: 0,
            userIndex: 0
        },
        {
            purchaseId: "P000002",
            timestamp: 1675522800,
            amount: 10000,
            method: 0,
            currency: "php",
            shopIndex: 0,
            userIndex: 0
        },
        {
            purchaseId: "P000003",
            timestamp: 1677942000,
            amount: 10000,
            method: 0,
            currency: "php",
            shopIndex: 0,
            userIndex: 0
        },
        {
            purchaseId: "P000004",
            timestamp: 1680620400,
            amount: 10000,
            method: 0,
            currency: "php",
            shopIndex: 1,
            userIndex: 0
        },
        {
            purchaseId: "P000005",
            timestamp: 1683212400,
            amount: 10000,
            method: 0,
            currency: "php",
            shopIndex: 2,
            userIndex: 0
        },
        {
            purchaseId: "P000005",
            timestamp: 1683212400,
            amount: 10000,
            method: 0,
            currency: "php",
            shopIndex: 3,
            userIndex: 0
        }
    ];

    let shop: IShopData;
    let userIndex: number;
    let shopIndex: number;

    let client: Client;
    beforeAll(async () => {
        const ctx = new Context(contextParams);
        client = new Client(ctx);
    });

    it("Server Health Checking", async () => {
        const isUp = await client.ledger.relay.isUp();
        expect(isUp).toEqual(true);
    });

    it("Prepare", async () => {
        await NodeInfo.transferBOA(userWallets.map((m) => m.address));
        await NodeInfo.transferBOA(shopWallets.map((m) => m.address));
        await NodeInfo.transferToken(
            contractInfo,
            userWallets.map((m) => m.address)
        );
        await NodeInfo.transferToken(
            contractInfo,
            shopWallets.map((m) => m.address)
        );

        for (const elem of shopData) {
            elem.shopId = ContractUtils.getShopId(elem.wallet.address, LoyaltyNetworkID.ACC);
        }
        await NodeInfo.addShopData(contractInfo, shopData);
    });

    it("Set Exchange Rate", async () => {
        await NodeInfo.setExchangeRate(contractInfo.currencyRate, validatorWallets);
    });

    it("Save Purchase Data", async () => {
        for (const purchase of purchaseData) {
            const phoneHash = ContractUtils.getPhoneHash(userData[purchase.userIndex].phone);
            const purchaseAmount = Amount.make(purchase.amount, 18).value;
            const loyaltyAmount = purchaseAmount.mul(1).div(100);
            const userAccount = userData[purchase.userIndex].address.trim();

            const purchaseParams = {
                purchaseId: NodeInfo.getPurchaseId(),
                amount: purchaseAmount,
                loyalty: loyaltyAmount,
                currency: purchase.currency.toLowerCase(),
                shopId: shopData[purchase.shopIndex].shopId,
                account: userAccount,
                phone: phoneHash,
                sender: await accounts[AccountIndex.FOUNDATION].getAddress()
            };
            const purchaseMessage = ContractUtils.getPurchasesMessage(0, [purchaseParams], NodeInfo.getChainId());
            const signatures = await Promise.all(
                validatorWallets.map((m) => ContractUtils.signMessage(m, purchaseMessage))
            );
            const proposeMessage = ContractUtils.getPurchasesProposeMessage(
                0,
                [purchaseParams],
                signatures,
                NodeInfo.getChainId()
            );
            const proposerSignature = await ContractUtils.signMessage(validatorWallets[4], proposeMessage);
            await contractInfo.loyaltyProvider
                .connect(validatorWallets[4])
                .savePurchase(0, [purchaseParams], signatures, proposerSignature);
        }
    });

    it("Check shop data", async () => {
        const shopInfo1 = await client.shop.getShopInfo(shopData[0].shopId);
        expect(shopInfo1.providedAmount.toString()).toEqual(
            Amount.make(10000 * 3, 18)
                .value.mul(1)
                .div(100)
                .toString()
        );

        const shopInfo2 = await client.shop.getShopInfo(shopData[1].shopId);
        expect(shopInfo2.providedAmount.toString()).toEqual(
            Amount.make(10000 * 1, 18)
                .value.mul(1)
                .div(100)
                .toString()
        );
        const shopInfo3 = await client.shop.getShopInfo(shopData[2].shopId);
        expect(shopInfo3.providedAmount.toString()).toEqual(
            Amount.make(10000 * 1, 18)
                .value.mul(1)
                .div(100)
                .toString()
        );
        const shopInfo4 = await client.shop.getShopInfo(shopData[3].shopId);
        expect(shopInfo4.providedAmount.toString()).toEqual(
            Amount.make(10000 * 1, 18)
                .value.mul(1)
                .div(100)
                .toString()
        );
    });

    it("Set User & Shop", async () => {
        userIndex = 0;
        shopIndex = 1;
    });

    it("Pay point", async () => {
        const purchase = {
            purchaseId: "P000100",
            timestamp: 1672849000,
            amount: 300,
            method: 0,
            currency: "php",
            shopIndex,
            userIndex
        };

        const purchaseAmount = Amount.make(purchase.amount, 18).value;

        client.usePrivateKey(userWallets[purchase.userIndex].privateKey);

        // Open New
        let res = await Network.post(
            new URL(contextParams.relayEndpoint + "v1/payment/new/open"),
            {
                purchaseId: purchase.purchaseId,
                amount: purchaseAmount.toString(),
                currency: purchase.currency.toLowerCase(),
                shopId: shopData[shopIndex].shopId,
                account: userWallets[userIndex].address
            },
            {
                Authorization: NodeInfo.RELAY_ACCESS_KEY
            }
        );
        assert.deepStrictEqual(res.code, 0);
        assert.notDeepStrictEqual(res.data, undefined);

        const paymentId = res.data.paymentId;

        await ContractUtils.delay(3000);

        // Approve New
        client.usePrivateKey(userWallets[userIndex].privateKey);
        for await (const step of client.ledger.approveNewPayment(
            paymentId,
            purchase.purchaseId,
            purchaseAmount,
            purchase.currency.toLowerCase(),
            shopData[shopIndex].shopId,
            true
        )) {
            switch (step.key) {
                case NormalSteps.PREPARED:
                    expect(step.paymentId).toEqual(paymentId);
                    expect(step.purchaseId).toEqual(purchase.purchaseId);
                    expect(step.amount).toEqual(purchaseAmount);
                    expect(step.currency).toEqual(purchase.currency.toLowerCase());
                    expect(step.shopId).toEqual(shopData[shopIndex].shopId);
                    expect(step.account).toEqual(userWallets[userIndex].address);
                    expect(step.signature).toMatch(/^0x[A-Fa-f0-9]{130}$/i);
                    break;
                case NormalSteps.SENT:
                    expect(step.paymentId).toEqual(paymentId);
                    expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                    break;
                case NormalSteps.APPROVED:
                    expect(step.paymentId).toEqual(paymentId);
                    expect(step.purchaseId).toEqual(purchase.purchaseId);
                    expect(step.currency).toEqual(purchase.currency.toLowerCase());
                    expect(step.shopId).toEqual(shopData[shopIndex].shopId);
                    expect(step.paidValue).toEqual(purchaseAmount);
                    break;
                default:
                    throw new Error("Unexpected pay point step: " + JSON.stringify(step, null, 2));
            }
        }

        await ContractUtils.delay(3000);

        // Close New
        res = await Network.post(new URL(contextParams.relayEndpoint + "v1/payment/new/close"), {
            accessKey: NodeInfo.RELAY_ACCESS_KEY,
            confirm: true,
            paymentId
        });
        assert.deepStrictEqual(res.code, 0);

        await ContractUtils.delay(2000);
    });

    it("Check Settlement", async () => {
        shopIndex = 1;
        shop = shopData[shopIndex];
        const expectedAmount = Amount.make(200, 18).value;
        const { refundableAmount } = await client.shop.getRefundableAmount(shop.shopId);
        expect(refundableAmount.toString()).toEqual(expectedAmount.toString());
    });

    it("Open Withdrawal", async () => {
        shopIndex = 1;
        client.usePrivateKey(shopWallets[shopIndex].privateKey);
        const refundAmount = Amount.make(200, 18).value;

        for await (const step of client.shop.refund(shop.shopId, refundAmount)) {
            switch (step.key) {
                case NormalSteps.PREPARED:
                    expect(step.shopId).toEqual(shop.shopId);
                    expect(step.account.toUpperCase()).toEqual(shopWallets[shopIndex].address.toUpperCase());
                    expect(step.signature).toMatch(/^0x[A-Fa-f0-9]{130}$/i);
                    break;
                case NormalSteps.SENT:
                    expect(step.shopId).toEqual(shop.shopId);
                    expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                    break;
                case NormalSteps.DONE:
                    expect(step.shopId).toEqual(shop.shopId);
                    expect(step.refundAmount.toString()).toEqual(refundAmount.toString());
                    expect(step.account.toUpperCase()).toEqual(shopWallets[shopIndex].address.toUpperCase());
                    break;
                default:
                    throw new Error("Unexpected open withdrawal step: " + JSON.stringify(step, null, 2));
            }
        }
    });
});
