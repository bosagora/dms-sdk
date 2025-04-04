import * as dotenv from "dotenv";

import { ContextParams } from "../../src";
import { AddressZero } from "@ethersproject/constants";
dotenv.config({ path: "env/.env" });

export const web3EndpointsMainnet = {
    working: "https://rpc.main.acccoin.io/",
    failing: "https://bad-url-gateway.io/"
};

export const web3EndpointsTestnet = {
    working: "https://rpc.test.acccoin.io/",
    failing: "https://bad-url-gateway.io/"
};

export const web3EndpointsDevnet = {
    working: "http://rpc-side.dev.acccoin.io:28545/",
    failing: "https://bad-url-gateway.io/"
};

export const TEST_WALLET = "d09672244a06a32f74d051e5adbbb62ae0eda27832a973159d475da6d53ba5c0";

export const relayEndpointsMainnet = {
    working: "https://relay.main.acccoin.io/",
    failing: "https://bad-url-gateway.io/"
};

export const relayEndpointsTestnet = {
    working: "https://relay.test.acccoin.io/",
    failing: "https://bad-url-gateway.io/"
};

export const relayEndpointsDevnet = {
    working: "http://relay.dev.acccoin.io:27070/",
    failing: "https://bad-url-gateway.io/"
};

export const contextParamsMainnet: ContextParams = {
    side: {
        network: 215110,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsMainnet.working,
        phoneLinkAddress: AddressZero,
        tokenAddress: AddressZero,
        validatorAddress: AddressZero,
        currencyRateAddress: AddressZero,
        shopAddress: AddressZero,
        ledgerAddress: AddressZero,
        loyaltyProviderAddress: AddressZero,
        loyaltyConsumerAddress: AddressZero,
        loyaltyExchangerAddress: AddressZero,
        loyaltyTransferAddress: AddressZero,
        loyaltyBridgeAddress: AddressZero,
        innerChainBridgeAddress: AddressZero
    },
    main: {
        network: 2151,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsMainnet.working,
        tokenAddress: AddressZero,
        loyaltyBridgeAddress: AddressZero,
        innerChainBridgeAddress: AddressZero,
        outerChainBridgeAddress: AddressZero
    },
    outer: {
        network: 56,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsMainnet.working,
        tokenAddress: AddressZero,
        outerChainBridgeAddress: AddressZero
    },
    relayEndpoint: relayEndpointsMainnet.working
};

export const contextParamsTestnet: ContextParams = {
    side: {
        network: 215115,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsTestnet.working,
        phoneLinkAddress: AddressZero,
        tokenAddress: AddressZero,
        validatorAddress: AddressZero,
        currencyRateAddress: AddressZero,
        shopAddress: AddressZero,
        ledgerAddress: AddressZero,
        loyaltyProviderAddress: AddressZero,
        loyaltyConsumerAddress: AddressZero,
        loyaltyExchangerAddress: AddressZero,
        loyaltyTransferAddress: AddressZero,
        loyaltyBridgeAddress: AddressZero,
        innerChainBridgeAddress: AddressZero
    },
    main: {
        network: 2019,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsTestnet.working,
        tokenAddress: AddressZero,
        loyaltyBridgeAddress: AddressZero,
        innerChainBridgeAddress: AddressZero,
        outerChainBridgeAddress: AddressZero
    },
    outer: {
        network: 79,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsTestnet.working,
        tokenAddress: AddressZero,
        outerChainBridgeAddress: AddressZero
    },
    relayEndpoint: relayEndpointsTestnet.working
};

export const contextParamsDevnet: ContextParams = {
    side: {
        network: 24680,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsDevnet.working,
        phoneLinkAddress: AddressZero,
        tokenAddress: AddressZero,
        validatorAddress: AddressZero,
        currencyRateAddress: AddressZero,
        shopAddress: AddressZero,
        ledgerAddress: AddressZero,
        loyaltyProviderAddress: AddressZero,
        loyaltyConsumerAddress: AddressZero,
        loyaltyExchangerAddress: AddressZero,
        loyaltyTransferAddress: AddressZero,
        loyaltyBridgeAddress: AddressZero,
        innerChainBridgeAddress: AddressZero
    },
    main: {
        network: 24600,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsDevnet.working,
        tokenAddress: AddressZero,
        loyaltyBridgeAddress: AddressZero,
        innerChainBridgeAddress: AddressZero,
        outerChainBridgeAddress: AddressZero
    },
    outer: {
        network: 24000,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsDevnet.working,
        tokenAddress: AddressZero,
        outerChainBridgeAddress: AddressZero
    },
    relayEndpoint: relayEndpointsDevnet.working
};

export const contextParamsFailing: ContextParams = {
    side: {
        network: 24680,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsMainnet.failing,
        phoneLinkAddress: AddressZero,
        tokenAddress: AddressZero,
        validatorAddress: AddressZero,
        currencyRateAddress: AddressZero,
        shopAddress: AddressZero,
        ledgerAddress: AddressZero,
        loyaltyProviderAddress: AddressZero,
        loyaltyConsumerAddress: AddressZero,
        loyaltyExchangerAddress: AddressZero,
        loyaltyTransferAddress: AddressZero,
        loyaltyBridgeAddress: AddressZero,
        innerChainBridgeAddress: AddressZero
    },
    main: {
        network: 24600,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsMainnet.failing,
        tokenAddress: AddressZero,
        loyaltyBridgeAddress: AddressZero,
        innerChainBridgeAddress: AddressZero,
        outerChainBridgeAddress: AddressZero
    },
    outer: {
        network: 24000,
        privateKey: TEST_WALLET,
        web3Provider: web3EndpointsDevnet.working,
        tokenAddress: AddressZero,
        outerChainBridgeAddress: AddressZero
    },
    relayEndpoint: relayEndpointsMainnet.failing
};
