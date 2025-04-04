// This file defines the interfaces of the context object holding client settings

import { Signer } from "@ethersproject/abstract-signer";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";

export type SideWeb3ContextParams = {
    privateKey: string;
    network: number;
    web3Provider: string;
    phoneLinkAddress: string;
    tokenAddress: string;
    validatorAddress: string;
    currencyRateAddress: string;
    shopAddress: string;
    ledgerAddress: string;
    loyaltyProviderAddress: string;
    loyaltyConsumerAddress: string;
    loyaltyExchangerAddress: string;
    loyaltyTransferAddress: string;
    loyaltyBridgeAddress: string;
    innerChainBridgeAddress: string;
};

export type MainWeb3ContextParams = {
    privateKey: string;
    network: number;
    web3Provider: string;
    tokenAddress: string;
    loyaltyBridgeAddress: string;
    innerChainBridgeAddress: string;
    outerChainBridgeAddress: string;
};

export type OuterWeb3ContextParams = {
    privateKey: string;
    network: number;
    web3Provider: string;
    tokenAddress: string;
    outerChainBridgeAddress: string;
};

// Context input parameters
export type Web3ContextParams = {
    side: SideWeb3ContextParams;
    main: MainWeb3ContextParams;
    outer: OuterWeb3ContextParams;
};

export type RelayContextParams = {
    relayEndpoint: string;
};

export type ContextParams = Web3ContextParams & RelayContextParams;

export type SideWeb3ContextState = {
    signer?: Signer;
    network: Networkish;
    web3Provider: JsonRpcProvider;
    phoneLinkAddress?: string;
    tokenAddress?: string;
    validatorAddress?: string;
    currencyRateAddress?: string;
    shopAddress?: string;
    ledgerAddress?: string;
    loyaltyProviderAddress?: string;
    loyaltyConsumerAddress?: string;
    loyaltyExchangerAddress?: string;
    loyaltyTransferAddress?: string;
    loyaltyBridgeAddress?: string;
    innerChainBridgeAddress: string;
};

export type MainWeb3ContextState = {
    signer?: Signer;
    network: Networkish;
    web3Provider: JsonRpcProvider;
    tokenAddress: string;
    loyaltyBridgeAddress: string;
    innerChainBridgeAddress: string;
    outerChainBridgeAddress: string;
};

export type OuterWeb3ContextState = {
    signer?: Signer;
    network: Networkish;
    web3Provider: JsonRpcProvider;
    tokenAddress: string;
    outerChainBridgeAddress: string;
};

// Context state data
export type Web3ContextState = {
    side: SideWeb3ContextState;
    main: MainWeb3ContextState;
    outer: OuterWeb3ContextState;
};

export type RelayContextState = {
    relayEndpoint?: string;
};

export type ContextState = Web3ContextState & RelayContextState;
