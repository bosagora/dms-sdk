import ganache, { Server } from "ganache";
import * as dotenv from "dotenv";
import { contextParamsLocalChain } from "./constants";
import { Signer } from "@ethersproject/abstract-signer";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";

dotenv.config({ path: "env/.env" });

export class GanacheServer {
    public static instance: Server;
    public static initialAccounts: any[];
    public static CHAIN_ID = 24680;
    public static PORT = 7545;

    public static async start() {
        if (GanacheServer.initialAccounts === undefined) {
            GanacheServer.initialAccounts = GanacheServer.CreateInitialAccounts();
        }

        GanacheServer.instance = ganache.server({
            chain: {
                chainId: GanacheServer.CHAIN_ID
            },
            miner: {
                blockGasLimit: 80000000,
                defaultGasPrice: 800
            },
            logging: {
                quiet: true
            },
            wallet: {
                accounts: GanacheServer.initialAccounts
            }
        });
        await GanacheServer.instance.listen(GanacheServer.PORT);
        return GanacheServer.instance;
    }

    public static CreateInitialAccounts(): any[] {
        const accounts: string[] = [];
        const reg_bytes64: RegExp = /^(0x)[0-9a-f]{64}$/i;
        if (
            process.env.DEPLOYER !== undefined &&
            process.env.DEPLOYER.trim() !== "" &&
            reg_bytes64.test(process.env.DEPLOYER)
        ) {
            accounts.push(process.env.DEPLOYER);
        } else {
            process.env.DEPLOYER = Wallet.createRandom().privateKey;
            accounts.push(process.env.DEPLOYER);
        }

        if (
            process.env.FOUNDATION !== undefined &&
            process.env.FOUNDATION.trim() !== "" &&
            reg_bytes64.test(process.env.FOUNDATION)
        ) {
            accounts.push(process.env.FOUNDATION);
        } else {
            process.env.FOUNDATION = Wallet.createRandom().privateKey;
            accounts.push(process.env.FOUNDATION);
        }

        if (
            process.env.SETTLEMENT !== undefined &&
            process.env.SETTLEMENT.trim() !== "" &&
            reg_bytes64.test(process.env.SETTLEMENT)
        ) {
            accounts.push(process.env.SETTLEMENT);
        } else {
            process.env.SETTLEMENT = Wallet.createRandom().privateKey;
            accounts.push(process.env.SETTLEMENT);
        }

        if (process.env.FEE !== undefined && process.env.FEE.trim() !== "" && reg_bytes64.test(process.env.FEE)) {
            accounts.push(process.env.FEE);
        } else {
            process.env.FEE = Wallet.createRandom().privateKey;
            accounts.push(process.env.FEE);
        }

        if (
            process.env.VALIDATOR1 !== undefined &&
            process.env.VALIDATOR1.trim() !== "" &&
            reg_bytes64.test(process.env.VALIDATOR1)
        ) {
            accounts.push(process.env.VALIDATOR1);
        } else {
            process.env.VALIDATOR1 = Wallet.createRandom().privateKey;
            accounts.push(process.env.VALIDATOR1);
        }

        if (
            process.env.VALIDATOR2 !== undefined &&
            process.env.VALIDATOR2.trim() !== "" &&
            reg_bytes64.test(process.env.VALIDATOR2)
        ) {
            accounts.push(process.env.VALIDATOR2);
        } else {
            process.env.VALIDATOR2 = Wallet.createRandom().privateKey;
            accounts.push(process.env.VALIDATOR2);
        }

        if (
            process.env.VALIDATOR3 !== undefined &&
            process.env.VALIDATOR3.trim() !== "" &&
            reg_bytes64.test(process.env.VALIDATOR3)
        ) {
            accounts.push(process.env.VALIDATOR3);
        } else {
            process.env.VALIDATOR3 = Wallet.createRandom().privateKey;
            accounts.push(process.env.VALIDATOR3);
        }

        if (process.env.USER1 !== undefined && process.env.USER1.trim() !== "" && reg_bytes64.test(process.env.USER1)) {
            accounts.push(process.env.USER1);
        } else {
            process.env.USER1 = Wallet.createRandom().privateKey;
            accounts.push(process.env.USER1);
        }

        if (process.env.USER2 !== undefined && process.env.USER2.trim() !== "" && reg_bytes64.test(process.env.USER2)) {
            accounts.push(process.env.USER2);
        } else {
            process.env.USER2 = Wallet.createRandom().privateKey;
            accounts.push(process.env.USER2);
        }

        if (process.env.USER3 !== undefined && process.env.USER3.trim() !== "" && reg_bytes64.test(process.env.USER3)) {
            accounts.push(process.env.USER3);
        } else {
            process.env.USER3 = Wallet.createRandom().privateKey;
            accounts.push(process.env.USER3);
        }

        if (process.env.USER4 !== undefined && process.env.USER4.trim() !== "" && reg_bytes64.test(process.env.USER4)) {
            accounts.push(process.env.USER4);
        } else {
            process.env.USER4 = Wallet.createRandom().privateKey;
            accounts.push(process.env.USER4);
        }

        if (process.env.USER5 !== undefined && process.env.USER5.trim() !== "" && reg_bytes64.test(process.env.USER5)) {
            accounts.push(process.env.USER5);
        } else {
            process.env.USER5 = Wallet.createRandom().privateKey;
            accounts.push(process.env.USER5);
        }

        if (process.env.SHOP1 !== undefined && process.env.SHOP1.trim() !== "" && reg_bytes64.test(process.env.SHOP1)) {
            accounts.push(process.env.SHOP1);
        } else {
            process.env.SHOP1 = Wallet.createRandom().privateKey;
            accounts.push(process.env.SHOP1);
        }

        if (process.env.SHOP2 !== undefined && process.env.SHOP2.trim() !== "" && reg_bytes64.test(process.env.SHOP2)) {
            accounts.push(process.env.SHOP2);
        } else {
            process.env.SHOP2 = Wallet.createRandom().privateKey;
            accounts.push(process.env.SHOP2);
        }

        if (process.env.SHOP3 !== undefined && process.env.SHOP3.trim() !== "" && reg_bytes64.test(process.env.SHOP3)) {
            accounts.push(process.env.SHOP3);
        } else {
            process.env.SHOP3 = Wallet.createRandom().privateKey;
            accounts.push(process.env.SHOP3);
        }

        if (process.env.SHOP4 !== undefined && process.env.SHOP4.trim() !== "" && reg_bytes64.test(process.env.SHOP4)) {
            accounts.push(process.env.SHOP4);
        } else {
            process.env.SHOP4 = Wallet.createRandom().privateKey;
            accounts.push(process.env.SHOP4);
        }

        if (process.env.SHOP5 !== undefined && process.env.SHOP5.trim() !== "" && reg_bytes64.test(process.env.SHOP5)) {
            accounts.push(process.env.SHOP5);
        } else {
            process.env.SHOP5 = Wallet.createRandom().privateKey;
            accounts.push(process.env.SHOP5);
        }

        return accounts.map((m) => {
            return {
                balance: "0x100000000000000000000",
                secretKey: m
            };
        });
    }

    public static accounts(): Wallet[] {
        if (GanacheServer.initialAccounts === undefined) {
            GanacheServer.initialAccounts = GanacheServer.CreateInitialAccounts();
        }
        return GanacheServer.initialAccounts.map((m) =>
            new Wallet(m.secretKey).connect(GanacheServer.createTestProvider())
        );
    }

    public static createTestProvider(): JsonRpcProvider {
        return new JsonRpcProvider(`http://localhost:${GanacheServer.PORT}`, GanacheServer.CHAIN_ID);
    }

    public static setTestProvider(provider: JsonRpcProvider) {
        contextParamsLocalChain.web3Providers = provider;
    }

    public static setTestWeb3Signer(signer: Signer) {
        contextParamsLocalChain.signer = signer;
    }
}
