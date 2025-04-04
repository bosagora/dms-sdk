import {
    ContextParams,
    MainWeb3ContextParams,
    OuterWeb3ContextParams,
    SideWeb3ContextParams,
    MainWeb3ContextState,
    OuterWeb3ContextState,
    SideWeb3ContextState,
    RelayContextState
} from "./interfaces/context";
import { SupportedNetwork, SupportedNetworkArray, SupportedNetworkGroup } from "./interfaces/common";
import { InvalidAddressError, UnsupportedProtocolError, UnsupportedNetworkError } from "kios-sdk-common-v2";
import { getNetwork } from "../utils/Utilty";
import { LIVE_CONTRACTS } from "./constants";

import { isAddress } from "@ethersproject/address";
import { Network } from "@ethersproject/networks";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { Wallet } from "@ethersproject/wallet";
export { ContextParams } from "./interfaces/context";

const supportedProtocols = ["https:", "http:"];
// if (typeof process !== "undefined" && process.env?.TESTING) {
//     supportedProtocols.push("http:");
// }

export class SideContext {
    protected state: SideWeb3ContextState = Object.assign({});

    // INTERNAL CONTEXT STATE

    /**
     * @param {Object} params
     *
     * @constructor
     */
    constructor(params: Partial<SideWeb3ContextParams>) {
        this.set(params);
    }

    /**
     * Getter for the network
     *
     * @var network
     *
     * @returns {Networkish}
     *
     * @public
     */
    get network() {
        return this.state.network;
    }

    /**
     * Getter for the Signer
     *
     * @var signer
     *
     * @returns {Signer}
     *
     * @public
     */
    get signer() {
        return this.state.signer;
    }

    // GETTERS

    /**
     * Getter for the web3 providers
     *
     * @var web3Provider
     *
     * @returns {JsonRpcProvider[]}
     *
     * @public
     */
    get web3Provider() {
        return this.state.web3Provider;
    }

    get tokenAddress(): string | undefined {
        return this.state.tokenAddress;
    }

    get phoneLinkAddress(): string | undefined {
        return this.state.phoneLinkAddress;
    }

    get validatorAddress(): string | undefined {
        return this.state.validatorAddress;
    }

    get currencyRateAddress(): string | undefined {
        return this.state.currencyRateAddress;
    }
    get shopAddress(): string | undefined {
        return this.state.shopAddress;
    }
    get ledgerAddress(): string | undefined {
        return this.state.ledgerAddress;
    }

    get loyaltyProviderAddress(): string | undefined {
        return this.state.loyaltyProviderAddress;
    }
    get loyaltyConsumerAddress(): string | undefined {
        return this.state.loyaltyConsumerAddress;
    }
    get loyaltyExchangerAddress(): string | undefined {
        return this.state.loyaltyExchangerAddress;
    }
    get loyaltyTransferAddress(): string | undefined {
        return this.state.loyaltyTransferAddress;
    }
    get loyaltyBridgeAddress(): string | undefined {
        return this.state.loyaltyBridgeAddress;
    }
    get innerChainBridgeAddress(): string | undefined {
        return this.state.innerChainBridgeAddress;
    }

    // INTERNAL HELPERS
    private static resolveNetwork(networkish: Networkish, ensRegistryAddress?: string): Network {
        const network = getNetwork(networkish);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworkArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        if (ensRegistryAddress) {
            if (!isAddress(ensRegistryAddress)) {
                throw new InvalidAddressError();
            } else {
                network.ensAddress = ensRegistryAddress;
            }
        }

        if (!network.ensAddress) {
            network.ensAddress = AddressZero;
        }
        return network;
    }

    private static resolveWeb3Provider(endpoint: string | JsonRpcProvider, network: Networkish): JsonRpcProvider {
        if (typeof endpoint === "string") {
            const url = new URL(endpoint);
            if (!supportedProtocols.includes(url.protocol)) {
                throw new UnsupportedProtocolError(url.protocol);
            }
            return new JsonRpcProvider(url.href, this.resolveNetwork(network));
        } else {
            return endpoint;
        }
    }

    setFull(contextParams: SideWeb3ContextParams): void {
        if (!contextParams.network) {
            throw new Error("Missing network");
        } else if (!contextParams.privateKey) {
            throw new Error("Please pass the required signer");
        } else if (!contextParams.web3Provider) {
            throw new Error("No web3 endpoints defined");
        } else if (!contextParams.tokenAddress) {
            throw new Error("Missing token contract address");
        } else if (!contextParams.phoneLinkAddress) {
            throw new Error("Missing link collection contract address");
        } else if (!contextParams.validatorAddress) {
            throw new Error("Missing validator collection contract address");
        } else if (!contextParams.currencyRateAddress) {
            throw new Error("Missing token price contract address");
        } else if (!contextParams.shopAddress) {
            throw new Error("Missing shop collection  contract address");
        } else if (!contextParams.ledgerAddress) {
            throw new Error("Missing ledger contract address");
        } else if (!contextParams.loyaltyProviderAddress) {
            throw new Error("Missing loyalty provider contract address");
        } else if (!contextParams.loyaltyConsumerAddress) {
            throw new Error("Missing loyalty consumer contract address");
        } else if (!contextParams.loyaltyExchangerAddress) {
            throw new Error("Missing loyalty exchanger contract address");
        } else if (!contextParams.loyaltyTransferAddress) {
            throw new Error("Missing loyalty transfer contract address");
        } else if (!contextParams.loyaltyBridgeAddress) {
            throw new Error("Missing loyalty bridge contract address");
        } else if (!contextParams.innerChainBridgeAddress) {
            throw new Error("Missing inner chain bridge contract address");
        }

        this.state = {
            network: contextParams.network,
            signer: new Wallet(contextParams.privateKey),
            web3Provider: SideContext.resolveWeb3Provider(contextParams.web3Provider, contextParams.network),
            tokenAddress: contextParams.tokenAddress,
            phoneLinkAddress: contextParams.phoneLinkAddress,
            validatorAddress: contextParams.validatorAddress,
            currencyRateAddress: contextParams.currencyRateAddress,
            shopAddress: contextParams.shopAddress,
            ledgerAddress: contextParams.ledgerAddress,
            loyaltyProviderAddress: contextParams.loyaltyProviderAddress,
            loyaltyConsumerAddress: contextParams.loyaltyConsumerAddress,
            loyaltyExchangerAddress: contextParams.loyaltyExchangerAddress,
            loyaltyTransferAddress: contextParams.loyaltyTransferAddress,
            loyaltyBridgeAddress: contextParams.loyaltyBridgeAddress,
            innerChainBridgeAddress: contextParams.innerChainBridgeAddress
        };
    }

    set(contextParams: Partial<SideWeb3ContextParams>) {
        if (contextParams.network) {
            this.state.network = contextParams.network;
        }
        if (contextParams.privateKey) {
            this.state.signer = new Wallet(contextParams.privateKey);
        }
        if (contextParams.web3Provider) {
            this.state.web3Provider = SideContext.resolveWeb3Provider(contextParams.web3Provider, this.state.network);
        }
        if (contextParams.tokenAddress) {
            this.state.tokenAddress = contextParams.tokenAddress;
        }
        if (contextParams.phoneLinkAddress) {
            this.state.phoneLinkAddress = contextParams.phoneLinkAddress;
        }
        if (contextParams.validatorAddress) {
            this.state.validatorAddress = contextParams.validatorAddress;
        }
        if (contextParams.currencyRateAddress) {
            this.state.currencyRateAddress = contextParams.currencyRateAddress;
        }
        if (contextParams.shopAddress) {
            this.state.shopAddress = contextParams.shopAddress;
        }
        if (contextParams.ledgerAddress) {
            this.state.ledgerAddress = contextParams.ledgerAddress;
        }
        if (contextParams.loyaltyProviderAddress) {
            this.state.loyaltyProviderAddress = contextParams.loyaltyProviderAddress;
        }
        if (contextParams.loyaltyConsumerAddress) {
            this.state.loyaltyConsumerAddress = contextParams.loyaltyConsumerAddress;
        }
        if (contextParams.loyaltyExchangerAddress) {
            this.state.loyaltyExchangerAddress = contextParams.loyaltyExchangerAddress;
        }
        if (contextParams.loyaltyTransferAddress) {
            this.state.loyaltyTransferAddress = contextParams.loyaltyTransferAddress;
        }
        if (contextParams.loyaltyBridgeAddress) {
            this.state.loyaltyBridgeAddress = contextParams.loyaltyBridgeAddress;
        }
        if (contextParams.innerChainBridgeAddress) {
            this.state.innerChainBridgeAddress = contextParams.innerChainBridgeAddress;
        }
    }
}

export class MainContext {
    protected state: MainWeb3ContextState = Object.assign({});

    constructor(params: Partial<MainWeb3ContextParams>) {
        this.set(params);
    }

    get network() {
        return this.state.network;
    }

    get signer() {
        return this.state.signer;
    }

    get web3Provider() {
        return this.state.web3Provider;
    }

    get tokenAddress(): string | undefined {
        return this.state.tokenAddress;
    }

    get loyaltyBridgeAddress(): string | undefined {
        return this.state.loyaltyBridgeAddress;
    }

    get innerChainBridgeAddress(): string | undefined {
        return this.state.innerChainBridgeAddress;
    }

    get outerChainBridgeAddress(): string | undefined {
        return this.state.outerChainBridgeAddress;
    }

    // INTERNAL HELPERS
    private static resolveNetwork(networkish: Networkish, ensRegistryAddress?: string): Network {
        const network = getNetwork(networkish);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworkArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        if (ensRegistryAddress) {
            if (!isAddress(ensRegistryAddress)) {
                throw new InvalidAddressError();
            } else {
                network.ensAddress = ensRegistryAddress;
            }
        }

        if (!network.ensAddress) {
            network.ensAddress = AddressZero;
        }
        return network;
    }

    private static resolveWeb3Provider(endpoint: string | JsonRpcProvider, network: Networkish): JsonRpcProvider {
        if (typeof endpoint === "string") {
            const url = new URL(endpoint);
            if (!supportedProtocols.includes(url.protocol)) {
                throw new UnsupportedProtocolError(url.protocol);
            }
            return new JsonRpcProvider(url.href, this.resolveNetwork(network));
        } else {
            return endpoint;
        }
    }

    setFull(contextParams: MainWeb3ContextParams): void {
        if (!contextParams.network) {
            throw new Error("Missing network");
        } else if (!contextParams.privateKey) {
            throw new Error("Please pass the required signer");
        } else if (!contextParams.web3Provider) {
            throw new Error("No web3 endpoints defined");
        } else if (!contextParams.tokenAddress) {
            throw new Error("Missing loyalty transfer contract address");
        } else if (!contextParams.loyaltyBridgeAddress) {
            throw new Error("Missing loyalty bridge contract address");
        } else if (!contextParams.innerChainBridgeAddress) {
            throw new Error("Missing inner chain bridge contract address");
        } else if (!contextParams.outerChainBridgeAddress) {
            throw new Error("Missing outer chain bridge contract address");
        }
        this.state = {
            network: contextParams.network,
            signer: new Wallet(contextParams.privateKey),
            web3Provider: MainContext.resolveWeb3Provider(contextParams.web3Provider, contextParams.network),
            tokenAddress: contextParams.tokenAddress,
            loyaltyBridgeAddress: contextParams.loyaltyBridgeAddress,
            innerChainBridgeAddress: contextParams.innerChainBridgeAddress,
            outerChainBridgeAddress: contextParams.outerChainBridgeAddress
        };
    }

    set(contextParams: Partial<MainWeb3ContextParams>) {
        if (contextParams.network) {
            this.state.network = contextParams.network;
        }
        if (contextParams.privateKey) {
            this.state.signer = new Wallet(contextParams.privateKey);
        }
        if (contextParams.web3Provider) {
            this.state.web3Provider = MainContext.resolveWeb3Provider(contextParams.web3Provider, this.state.network);
        }
        if (contextParams.tokenAddress) {
            this.state.tokenAddress = contextParams.tokenAddress;
        }
        if (contextParams.loyaltyBridgeAddress) {
            this.state.loyaltyBridgeAddress = contextParams.loyaltyBridgeAddress;
        }
        if (contextParams.innerChainBridgeAddress) {
            this.state.innerChainBridgeAddress = contextParams.innerChainBridgeAddress;
        }
        if (contextParams.outerChainBridgeAddress) {
            this.state.outerChainBridgeAddress = contextParams.outerChainBridgeAddress;
        }
    }
}

export class OuterContext {
    protected state: OuterWeb3ContextState = Object.assign({});

    constructor(params: Partial<OuterWeb3ContextParams>) {
        this.set(params);
    }

    get network() {
        return this.state.network;
    }

    get signer() {
        return this.state.signer;
    }

    get web3Provider() {
        return this.state.web3Provider;
    }

    get tokenAddress(): string | undefined {
        return this.state.tokenAddress;
    }

    get outerChainBridgeAddress(): string | undefined {
        return this.state.outerChainBridgeAddress;
    }

    // INTERNAL HELPERS
    private static resolveNetwork(networkish: Networkish, ensRegistryAddress?: string): Network {
        const network = getNetwork(networkish);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworkArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        if (ensRegistryAddress) {
            if (!isAddress(ensRegistryAddress)) {
                throw new InvalidAddressError();
            } else {
                network.ensAddress = ensRegistryAddress;
            }
        }

        if (!network.ensAddress) {
            network.ensAddress = AddressZero;
        }
        return network;
    }

    private static resolveWeb3Provider(endpoint: string | JsonRpcProvider, network: Networkish): JsonRpcProvider {
        if (typeof endpoint === "string") {
            const url = new URL(endpoint);
            if (!supportedProtocols.includes(url.protocol)) {
                throw new UnsupportedProtocolError(url.protocol);
            }
            return new JsonRpcProvider(url.href, this.resolveNetwork(network));
        } else {
            return endpoint;
        }
    }

    setFull(contextParams: OuterWeb3ContextParams): void {
        if (!contextParams.network) {
            throw new Error("Missing network");
        } else if (!contextParams.privateKey) {
            throw new Error("Please pass the required signer");
        } else if (!contextParams.web3Provider) {
            throw new Error("No web3 endpoints defined");
        } else if (!contextParams.tokenAddress) {
            throw new Error("Missing loyalty transfer contract address");
        } else if (!contextParams.outerChainBridgeAddress) {
            throw new Error("Missing outer chain bridge contract address");
        }
        this.state = {
            network: contextParams.network,
            signer: new Wallet(contextParams.privateKey),
            web3Provider: OuterContext.resolveWeb3Provider(contextParams.web3Provider, contextParams.network),
            tokenAddress: contextParams.tokenAddress,
            outerChainBridgeAddress: contextParams.outerChainBridgeAddress
        };
    }

    set(contextParams: Partial<OuterWeb3ContextParams>) {
        if (contextParams.network) {
            this.state.network = contextParams.network;
        }
        if (contextParams.privateKey) {
            this.state.signer = new Wallet(contextParams.privateKey);
        }
        if (contextParams.web3Provider) {
            this.state.web3Provider = OuterContext.resolveWeb3Provider(contextParams.web3Provider, this.state.network);
        }
        if (contextParams.tokenAddress) {
            this.state.tokenAddress = contextParams.tokenAddress;
        }
        if (contextParams.outerChainBridgeAddress) {
            this.state.outerChainBridgeAddress = contextParams.outerChainBridgeAddress;
        }
    }
}

export class Context {
    protected state: RelayContextState = Object.assign({});
    public side: SideContext;
    public main: MainContext;
    public outer: OuterContext;

    // INTERNAL CONTEXT STATE

    /**
     * @param {Object} params
     *
     * @constructor
     */
    constructor(params: Partial<ContextParams>) {
        this.side = new SideContext(params.side as SideWeb3ContextParams);
        this.main = new MainContext(params.side as SideWeb3ContextParams);
        this.outer = new OuterContext(params.side as SideWeb3ContextParams);
        this.set(params);
    }

    get relayEndpoint() {
        return this.state.relayEndpoint;
    }

    /**
     * Does set and parse the given context configuration object
     *
     * @returns {void}
     *
     * @private
     */
    setFull(contextParams: ContextParams): void {
        this.state = {
            relayEndpoint: contextParams.relayEndpoint
        };
    }

    set(contextParams: Partial<ContextParams>) {
        if (contextParams.relayEndpoint) {
            this.state.relayEndpoint = contextParams.relayEndpoint;
        }
    }
}

export class ContextBuilder {
    public static buildContextParams(networkName: SupportedNetworkGroup, defaultPrivateKey: string): ContextParams {
        return {
            relayEndpoint: LIVE_CONTRACTS[networkName].relayEndpoint,
            side: {
                network: LIVE_CONTRACTS[networkName].side.network,
                web3Provider: LIVE_CONTRACTS[networkName].side.web3Endpoint,
                privateKey: defaultPrivateKey,
                tokenAddress: LIVE_CONTRACTS[networkName].side.LoyaltyTokenAddress,
                phoneLinkAddress: LIVE_CONTRACTS[networkName].side.PhoneLinkCollectionAddress,
                validatorAddress: LIVE_CONTRACTS[networkName].side.ValidatorAddress,
                currencyRateAddress: LIVE_CONTRACTS[networkName].side.CurrencyRateAddress,
                shopAddress: LIVE_CONTRACTS[networkName].side.ShopAddress,
                ledgerAddress: LIVE_CONTRACTS[networkName].side.LedgerAddress,
                loyaltyProviderAddress: LIVE_CONTRACTS[networkName].side.LoyaltyProviderAddress,
                loyaltyConsumerAddress: LIVE_CONTRACTS[networkName].side.LoyaltyConsumerAddress,
                loyaltyExchangerAddress: LIVE_CONTRACTS[networkName].side.LoyaltyExchangerAddress,
                loyaltyTransferAddress: LIVE_CONTRACTS[networkName].side.LoyaltyTransferAddress,
                loyaltyBridgeAddress: LIVE_CONTRACTS[networkName].side.LoyaltyBridgeAddress,
                innerChainBridgeAddress: LIVE_CONTRACTS[networkName].side.InnerChainBridgeAddress
            },
            main: {
                network: LIVE_CONTRACTS[networkName].main.network,
                web3Provider: LIVE_CONTRACTS[networkName].main.web3Endpoint,
                privateKey: defaultPrivateKey,
                tokenAddress: LIVE_CONTRACTS[networkName].main.LoyaltyTokenAddress,
                loyaltyBridgeAddress: LIVE_CONTRACTS[networkName].main.LoyaltyBridgeAddress,
                innerChainBridgeAddress: LIVE_CONTRACTS[networkName].main.InnerChainBridgeAddress,
                outerChainBridgeAddress: LIVE_CONTRACTS[networkName].main.OuterChainBridgeAddress
            },
            outer: {
                network: LIVE_CONTRACTS[networkName].outer.network,
                web3Provider: LIVE_CONTRACTS[networkName].outer.web3Endpoint,
                privateKey: defaultPrivateKey,
                tokenAddress: LIVE_CONTRACTS[networkName].outer.LoyaltyTokenAddress,
                outerChainBridgeAddress: LIVE_CONTRACTS[networkName].outer.OuterChainBridgeAddress
            }
        };
    }

    public static buildContextParamsOfMainGroup(defaultPrivateKey: string): ContextParams {
        return ContextBuilder.buildContextParams(SupportedNetworkGroup.MAIN_GROUP, defaultPrivateKey);
    }

    public static buildContextParamsOfTestGroup(defaultPrivateKey: string): ContextParams {
        return ContextBuilder.buildContextParams(SupportedNetworkGroup.TEST_GROUP, defaultPrivateKey);
    }

    public static buildContextParamsOfDevGroup(defaultPrivateKey: string): ContextParams {
        return ContextBuilder.buildContextParams(SupportedNetworkGroup.DEV_GROUP, defaultPrivateKey);
    }

    public static buildContext(networkName: SupportedNetworkGroup, defaultPrivateKey: string): Context {
        const contextParams = ContextBuilder.buildContextParams(networkName, defaultPrivateKey);
        return new Context(contextParams);
    }

    public static buildContextOfMainGroup(defaultPrivateKey: string): Context {
        return ContextBuilder.buildContext(SupportedNetworkGroup.MAIN_GROUP, defaultPrivateKey);
    }

    public static buildContextOfTestGroup(defaultPrivateKey: string): Context {
        return ContextBuilder.buildContext(SupportedNetworkGroup.TEST_GROUP, defaultPrivateKey);
    }

    public static buildContextOfDevGroup(defaultPrivateKey: string): Context {
        return ContextBuilder.buildContext(SupportedNetworkGroup.DEV_GROUP, defaultPrivateKey);
    }
}
