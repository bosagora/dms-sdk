import { Server } from "ganache";
import { GanacheServer } from "./helper/GanacheServer";
import * as deployContracts from "./helper/deployContracts";
import { purchaseData } from "./helper/deployContracts";
import { contextParamsLocalChain } from "./helper/constants";
import { Amount, Client, Context, ContractUtils,DepositSteps } from "../src";
import { FakerRelayServer } from "./helper/FakerRelayServer";
import { Signer } from "@ethersproject/abstract-signer";

describe("Client", () => {
    let node: Server;
    let deployment: deployContracts.Deployment;
    let fakerRelayServer: FakerRelayServer;
    const [, , validator1, validator2, , user1] = GanacheServer.accounts();

    describe("Save Purchase Data & Pay (mileage, token)", () => {
        beforeAll(async () => {
            node = await GanacheServer.start();
            const provider = GanacheServer.createTestProvider();
            GanacheServer.setTestProvider(provider);

            deployment = await deployContracts.deployAll(provider);
            contextParamsLocalChain.tokenAddress = deployment.token.address;
            contextParamsLocalChain.linkCollectionAddress = deployment.linkCollection.address;
            contextParamsLocalChain.validatorCollectionAddress = deployment.validatorCollection.address;
            contextParamsLocalChain.tokenPriceAddress = deployment.tokenPrice.address;
            contextParamsLocalChain.franchiseeCollectionAddress = deployment.franchiseeCollection.address;
            contextParamsLocalChain.ledgerAddress = deployment.ledger.address;
            contextParamsLocalChain.web3Providers = deployment.provider;

            GanacheServer.setTestWeb3Signer(user1);

            fakerRelayServer = new FakerRelayServer(7070, deployment);
            await fakerRelayServer.start();
        });

        afterAll(async () => {
            await node.close();
            await fakerRelayServer.stop();
        });

        describe("Method Check", () => {
            let client: Client;
            beforeAll(async () => {
                const ctx = new Context(contextParamsLocalChain);
                client = new Client(ctx);
            });

            let signer: Signer;
            let userAddress: string;
            let email: string;
            let emailHash: string;
            const depositToken = Amount.make(20_000, 18).value;
            const exchangeToken = Amount.make(10_000, 18).value;
            beforeAll(async () => {
                signer = client.web3.getConnectedSigner();
                userAddress = await signer.getAddress();
                email = purchaseData[0].userEmail;
                emailHash = ContractUtils.sha256String(email);
            });

            it("Server Health Checking", async () => {
                const isUp = await client.methods.isRelayUp();
                expect(isUp).toEqual(true);
            });

            describe("Prepare Deposit & Exchange", () => {
                it("Link email-address", async () => {
                    const nonce = await deployment.linkCollection.nonceOf(userAddress);
                    const signature = await ContractUtils.sign(signer, emailHash, nonce);
                    const requestId = ContractUtils.getRequestId(emailHash, userAddress, nonce);
                    //Add Email
                    await deployment.linkCollection
                        .connect(signer)
                        .addRequest(requestId, emailHash, userAddress, signature);
                    // Vote
                    await deployment.linkCollection.connect(validator1).voteRequest(requestId, 1);
                    await deployment.linkCollection.connect(validator2).voteRequest(requestId, 1);
                    await deployment.linkCollection.connect(validator1).countVote(requestId);
                });

                it("Deposit token", async () => {
                    await deployment.token.connect(signer).approve(deployment.ledger.address, depositToken);
                    await deployment.ledger.connect(signer).deposit(depositToken);
                });

                it("Exchange token to mileage", async () => {
                    const nonce = await deployment.ledger.nonceOf(userAddress);
                    const signature = await ContractUtils.signExchange(signer, emailHash, exchangeToken, nonce);

                    await deployment.ledger
                        .connect(signer)
                        .exchangeTokenToMileage(emailHash, exchangeToken, userAddress, signature);
                });
            });

            describe("Balance Check", () => {
                it("Test getting the mileage balance", async () => {
                    const balance = await client.methods.getMileageBalances(email);
                    expect(balance).toEqual(exchangeToken.mul(150));
                });

                it("Test getting the token balance", async () => {
                    const balance = await client.methods.getTokenBalances(email);
                    expect(balance).toEqual(depositToken.sub(exchangeToken));
                });
            });

            describe("Pay Check", () => {
                it("Test of pay mileage", async () => {
                    const exampleData = purchaseData[0];
                    const option = await client.methods.getPayMileageOption(
                        exampleData.purchaseId,
                        Amount.make(exampleData.amount, 18).value,
                        exampleData.userEmail,
                        exampleData.franchiseeId
                    );
                    const responseData = await client.methods.fetchPayMileage(option);
                    expect(responseData.data.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                });
                it("Test of pay token", async () => {
                    const exampleData = purchaseData[0];
                    const option = await client.methods.getPayTokenOption(
                        exampleData.purchaseId,
                        Amount.make(exampleData.amount, 18).value,
                        exampleData.userEmail,
                        exampleData.franchiseeId
                    );
                    const responseData = await client.methods.fetchPayToken(option);
                    expect(responseData.data.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                });
            });

            describe("Exchange Check", () => {
                const amountDepositToken = Amount.make(10_000, 18);
                beforeAll(async () => {
                    await deployment.token.connect(signer).approve(deployment.ledger.address, amountDepositToken.value);
                    await deployment.ledger.connect(signer).deposit(amountDepositToken.value);
                });

                it("Test of token to mileage exchange", async () => {
                    const option = await client.methods.getTokenToMileageOption(email, amountDepositToken.value);
                    const responseData = await client.methods.fetchExchangeTokenToMileage(option);
                    expect(responseData.data.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                });

                it("Test of mileage to token exchange", async () => {
                    const option = await client.methods.getMileageToTokenOption(email, amountDepositToken.value);
                    const responseData = await client.methods.fetchExchangeMileageToToken(option);
                    expect(responseData.data.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                });
            });

            describe("Deposit & withdraw", () => {
                const tradeAmount = 10_000;
                const amountToTrade = Amount.make(tradeAmount, 18);

                it("Test of the deposit", async () => {
                    const beforeBalance = await deployment.ledger.tokenBalanceOf(emailHash);

                    for await (const step of client.methods.deposit(email, amountToTrade.value)) {
                        switch (step.key) {
                            case DepositSteps.CHECKED_ALLOWANCE:
                                expect(step.allowance instanceof BigNumber).toBe(true);
                                expect(step.allowance.toString()).toBe("0");
                                break;
                            case DepositSteps.UPDATING_ALLOWANCE:
                                expect(typeof step.txHash).toBe("string");
                                expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                                break;
                            case DepositSteps.UPDATED_ALLOWANCE:
                                expect(step.allowance instanceof BigNumber).toBe(true);
                                expect(step.allowance.toString()).toBe(amountToTrade.toString());
                                break;
                            case DepositSteps.DEPOSITING:
                                expect(typeof step.txHash).toBe("string");
                                expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                                break;
                            case DepositSteps.DONE:
                                expect(step.amount instanceof BigNumber).toBe(true);
                                expect(step.amount.toString()).toBe(amountToTrade.toString());
                                break;
                            default:
                                throw new Error("Unexpected DAO deposit step: " + JSON.stringify(step, null, 2));
                        }
                    }

                    const afterBalance = await deployment.ledger.tokenBalanceOf(emailHash);
                    expect(afterBalance.toString()).toEqual(beforeBalance.add(amountToTrade.value).toString());
                });
                it("Test of the withdraw", async () => {
                    const beforeBalance = await deployment.ledger.tokenBalanceOf(emailHash);
                    await client.methods.withdraw(email, amountToTrade.value);
                    const afterBalance = await deployment.ledger.tokenBalanceOf(emailHash);
                    expect(afterBalance.toString()).toEqual(beforeBalance.sub(amountToTrade.value).toString());
                });
            });
        });
    });
});
