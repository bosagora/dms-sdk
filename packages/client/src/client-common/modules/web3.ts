import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";
import { Contract, ContractInterface } from "@ethersproject/contracts";
import { Signer } from "@ethersproject/abstract-signer";
import { IClientWeb3Core } from "../interfaces/core";
import { Context } from "../context";
import {
    NoShopCollectionAddress,
    NoLedgerAddress,
    NoLinkCollectionAddress,
    NoTokenAddress,
    NoCurrencyRateAddress,
    NoValidatorCollectionAddress,
    NoLoyaltyProviderAddress,
    NoLoyaltyConsumerAddress,
    NoLoyaltyExchangerAddress,
    NoLoyaltyTransferAddress,
    NoLoyaltyBridgeAddress,
    NoNetwork
} from "../../utils/errors";

import { UnsupportedNetworkError } from "dms-sdk-common-v2";

const networkMap = new Map<Web3Module, Networkish>();
const providersMap = new Map<Web3Module, JsonRpcProvider>();
const signerMap = new Map<Web3Module, Signer>();

const tokenAddressMap = new Map<Web3Module, string>();
const linkAddressMap = new Map<Web3Module, string>();
const validatorAddressMap = new Map<Web3Module, string>();
const currencyRateAddressMap = new Map<Web3Module, string>();
const shopAddressMap = new Map<Web3Module, string>();
const ledgerAddressMap = new Map<Web3Module, string>();
const providerAddressMap = new Map<Web3Module, string>();
const consumerAddressMap = new Map<Web3Module, string>();
const exchangerAddressMap = new Map<Web3Module, string>();
const transferAddressMap = new Map<Web3Module, string>();
const bridgeAddressMap = new Map<Web3Module, string>();

export class Web3Module implements IClientWeb3Core {
    constructor(context: Context) {
        // Storing client data in the private module's scope to prevent external mutation
        if (context.network) {
            networkMap.set(this, context.network);
        }

        if (context.web3Provider) {
            providersMap.set(this, context.web3Provider);
        }

        if (context.signer) {
            this.useSigner(context.signer);
        }

        if (context.tokenAddress) {
            tokenAddressMap.set(this, context.tokenAddress);
        }

        if (context.phoneLinkAddress) {
            linkAddressMap.set(this, context.phoneLinkAddress);
        }

        if (context.validatorAddress) {
            validatorAddressMap.set(this, context.validatorAddress);
        }

        if (context.currencyRateAddress) {
            currencyRateAddressMap.set(this, context.currencyRateAddress);
        }

        if (context.shopAddress) {
            shopAddressMap.set(this, context.shopAddress);
        }

        if (context.ledgerAddress) {
            ledgerAddressMap.set(this, context.ledgerAddress);
        }

        if (context.loyaltyProviderAddress) {
            providerAddressMap.set(this, context.loyaltyProviderAddress);
        }

        if (context.loyaltyConsumerAddress) {
            consumerAddressMap.set(this, context.loyaltyConsumerAddress);
        }

        if (context.loyaltyExchangerAddress) {
            exchangerAddressMap.set(this, context.loyaltyExchangerAddress);
        }

        if (context.loyaltyTransferAddress) {
            transferAddressMap.set(this, context.loyaltyTransferAddress);
        }

        if (context.loyaltyBridgeAddress) {
            bridgeAddressMap.set(this, context.loyaltyBridgeAddress);
        }

        Object.freeze(Web3Module.prototype);
        Object.freeze(this);
    }

    private get network(): Networkish | undefined {
        return networkMap.get(this);
    }

    private get tokenAddress(): string {
        return tokenAddressMap.get(this) || "";
    }

    private get phoneLinkAddress(): string {
        return linkAddressMap.get(this) || "";
    }

    private get validatorAddress(): string {
        return validatorAddressMap.get(this) || "";
    }

    private get currencyRateAddress(): string {
        return currencyRateAddressMap.get(this) || "";
    }

    private get shopAddress(): string {
        return shopAddressMap.get(this) || "";
    }

    private get ledgerAddress(): string {
        return ledgerAddressMap.get(this) || "";
    }

    private get loyaltyProviderAddress(): string {
        return providerAddressMap.get(this) || "";
    }

    private get loyaltyConsumerAddress(): string {
        return consumerAddressMap.get(this) || "";
    }

    private get loyaltyExchangerAddress(): string {
        return exchangerAddressMap.get(this) || "";
    }

    private get loyaltyTransferAddress(): string {
        return transferAddressMap.get(this) || "";
    }

    private get loyaltyBridgeAddress(): string {
        return bridgeAddressMap.get(this) || "";
    }

    private get provider(): JsonRpcProvider | undefined {
        return providersMap.get(this);
    }

    private get signer(): Signer | undefined {
        return signerMap.get(this);
    }

    public usePrivateKey(privateKey: string): void {
        const provider = this.getProvider();
        const signer = provider !== undefined ? new Wallet(privateKey, provider) : new Wallet(privateKey);
        signerMap.set(this, signer);
    }

    /** Replaces the current signer by the given one */
    public useSigner(signer: Signer): void {
        if (!signer) {
            throw new Error("Empty wallet or signer");
        }
        signerMap.set(this, signer);
    }

    /** Retrieves the current signer */
    public getSigner(): Signer | undefined {
        return this.signer;
    }

    /** Returns a signer connected to the current network provider */
    public getConnectedSigner(): Signer {
        let signer = this.getSigner();
        if (!signer) {
            throw new Error("No signer");
        } else if (!signer.provider && !this.getProvider()) {
            throw new Error("No provider");
        } else if (signer.provider) {
            return signer;
        }

        const provider = this.getProvider();
        if (!provider) throw new Error("No provider");

        signer = signer.connect(provider);
        return signer;
    }

    /** Returns the currently active network provider */
    public getProvider(): JsonRpcProvider | undefined {
        return this.provider;
    }

    /** Returns whether the current provider is functional or not */
    public isUp(): Promise<boolean> {
        const provider = this.getProvider();
        if (!provider) return Promise.reject(new Error("No provider"));

        return provider
            .getNetwork()
            .then(() => true)
            .catch(() => false);
    }

    /**
     * Returns a contract instance at the given address
     *
     * @param address Contract instance address
     * @param abi The Application Binary Inteface of the contract
     * @return A contract instance attached to the given address
     */
    public attachContract<T>(address: string, abi: ContractInterface): Contract & T {
        if (!address) throw new Error("Invalid contract address");
        else if (!abi) throw new Error("Invalid contract ABI");

        const signer = this.getSigner();
        if (!signer && !this.getProvider()) {
            throw new Error("No signer");
        }

        const provider = this.getProvider();
        if (!provider) throw new Error("No provider");

        const contract = new Contract(address, abi, provider);

        if (!signer) {
            return contract as Contract & T;
        } else if (signer instanceof Wallet) {
            return contract.connect(signer.connect(provider)) as Contract & T;
        }

        return contract.connect(signer) as Contract & T;
    }

    public getNetwork(): Networkish {
        if (!this.network) {
            throw new NoNetwork();
        }
        return this.network;
    }

    public getChainId(): number {
        const network = this.getNetwork();
        if (typeof network == "string") {
            throw new UnsupportedNetworkError(network);
        } else if (typeof network == "number") {
            return network;
        } else {
            if (network.chainId !== undefined) return network.chainId;
            else throw new UnsupportedNetworkError("");
        }
    }

    public getTokenAddress(): string {
        if (!this.tokenAddress) {
            throw new NoTokenAddress();
        }
        return this.tokenAddress;
    }

    public getLinkAddress(): string {
        if (!this.phoneLinkAddress) {
            throw new NoLinkCollectionAddress();
        }
        return this.phoneLinkAddress;
    }

    public getValidatorAddress(): string {
        if (!this.validatorAddress) {
            throw new NoValidatorCollectionAddress();
        }
        return this.validatorAddress;
    }

    public getCurrencyRateAddress(): string {
        if (!this.currencyRateAddress) {
            throw new NoCurrencyRateAddress();
        }
        return this.currencyRateAddress;
    }

    public getShopAddress(): string {
        if (!this.shopAddress) {
            throw new NoShopCollectionAddress();
        }
        return this.shopAddress;
    }

    public getLedgerAddress(): string {
        if (!this.ledgerAddress) {
            throw new NoLedgerAddress();
        }
        return this.ledgerAddress;
    }

    public getLoyaltyProviderAddress(): string {
        if (!this.loyaltyProviderAddress) {
            throw new NoLoyaltyProviderAddress();
        }
        return this.loyaltyProviderAddress;
    }

    public getLoyaltyConsumerAddress(): string {
        if (!this.loyaltyConsumerAddress) {
            throw new NoLoyaltyConsumerAddress();
        }
        return this.loyaltyConsumerAddress;
    }

    public getLoyaltyExchangerAddress(): string {
        if (!this.loyaltyExchangerAddress) {
            throw new NoLoyaltyExchangerAddress();
        }
        return this.loyaltyExchangerAddress;
    }

    public getLoyaltyTransferAddress(): string {
        if (!this.loyaltyTransferAddress) {
            throw new NoLoyaltyTransferAddress();
        }
        return this.loyaltyTransferAddress;
    }

    public getLoyaltyBridgeAddress(): string {
        if (!this.loyaltyBridgeAddress) {
            throw new NoLoyaltyBridgeAddress();
        }
        return this.loyaltyBridgeAddress;
    }
}
