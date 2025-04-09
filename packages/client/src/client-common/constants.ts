import { NetworkDeployment, SupportedNetworkGroup, SupportedNetwork } from "./interfaces/common";
import { activeContractsList } from "kios-contracts-lib-v2";
import { Network } from "@ethersproject/networks";

export const LIVE_CONTRACTS: { [K in SupportedNetworkGroup]: NetworkDeployment } = {
    main_group: {
        side: {
            network: 215120,
            web3Endpoint: "https://rpc.main.kioscoin.io/",
            PhoneLinkCollectionAddress: activeContractsList.mainnet.PhoneLinkCollection,
            LoyaltyTokenAddress: activeContractsList.mainnet.LoyaltyToken,
            ValidatorAddress: activeContractsList.mainnet.Validator,
            CurrencyRateAddress: activeContractsList.mainnet.CurrencyRate,
            ShopAddress: activeContractsList.mainnet.Shop,
            LedgerAddress: activeContractsList.mainnet.Ledger,
            LoyaltyProviderAddress: activeContractsList.mainnet.LoyaltyProvider,
            LoyaltyConsumerAddress: activeContractsList.mainnet.LoyaltyConsumer,
            LoyaltyExchangerAddress: activeContractsList.mainnet.LoyaltyExchanger,
            LoyaltyTransferAddress: activeContractsList.mainnet.LoyaltyTransfer,
            LoyaltyBridgeAddress: activeContractsList.mainnet.LoyaltyBridge,
            InnerChainBridgeAddress: ""
        },
        main: {
            network: 2151,
            web3Endpoint: "https://mainnet.bosagora.org/",
            LoyaltyTokenAddress: activeContractsList.mainnet.LoyaltyToken,
            LoyaltyBridgeAddress: "",
            InnerChainBridgeAddress: "",
            OuterChainBridgeAddress: ""
        },
        outer: {
            network: 56,
            web3Endpoint: "https://binance.llamarpc.com",
            LoyaltyTokenAddress: activeContractsList.mainnet.LoyaltyToken,
            OuterChainBridgeAddress: ""
        },
        relayEndpoint: "https://relay.main.kioscoin.io/"
    },
    test_group: {
        side: {
            network: 215125,
            web3Endpoint: "https://rpc.test.kioscoin.io/",
            PhoneLinkCollectionAddress: activeContractsList.testnet.PhoneLinkCollection,
            LoyaltyTokenAddress: activeContractsList.testnet.LoyaltyToken,
            ValidatorAddress: activeContractsList.testnet.Validator,
            CurrencyRateAddress: activeContractsList.testnet.CurrencyRate,
            ShopAddress: activeContractsList.testnet.Shop,
            LedgerAddress: activeContractsList.testnet.Ledger,
            LoyaltyProviderAddress: activeContractsList.testnet.LoyaltyProvider,
            LoyaltyConsumerAddress: activeContractsList.testnet.LoyaltyConsumer,
            LoyaltyExchangerAddress: activeContractsList.testnet.LoyaltyExchanger,
            LoyaltyTransferAddress: activeContractsList.testnet.LoyaltyTransfer,
            LoyaltyBridgeAddress: activeContractsList.testnet.LoyaltyBridge,
            InnerChainBridgeAddress: ""
        },
        main: {
            network: 2019,
            web3Endpoint: "https://testnet.bosagora.org/",
            LoyaltyTokenAddress: "",
            LoyaltyBridgeAddress: "",
            InnerChainBridgeAddress: "",
            OuterChainBridgeAddress: ""
        },
        outer: {
            network: 97,
            web3Endpoint: "https://bsc-testnet.drpc.org",
            LoyaltyTokenAddress: "",
            OuterChainBridgeAddress: ""
        },
        relayEndpoint: "https://relay.test.kioscoin.io/"
    },
    dev_group: {
        side: {
            network: 24000,
            web3Endpoint: "http://127.0.0.1:8500",
            PhoneLinkCollectionAddress: activeContractsList.devnet.PhoneLinkCollection,
            LoyaltyTokenAddress: activeContractsList.devnet.LoyaltyToken,
            ValidatorAddress: activeContractsList.devnet.Validator,
            CurrencyRateAddress: activeContractsList.devnet.CurrencyRate,
            ShopAddress: activeContractsList.devnet.Shop,
            LedgerAddress: activeContractsList.devnet.Ledger,
            LoyaltyProviderAddress: activeContractsList.devnet.LoyaltyProvider,
            LoyaltyConsumerAddress: activeContractsList.devnet.LoyaltyConsumer,
            LoyaltyExchangerAddress: activeContractsList.devnet.LoyaltyExchanger,
            LoyaltyTransferAddress: activeContractsList.devnet.LoyaltyTransfer,
            LoyaltyBridgeAddress: activeContractsList.devnet.LoyaltyBridge,
            InnerChainBridgeAddress: "0xB7766345d2b0141cCB98a5C6130Ba63972eba956"
        },
        main: {
            network: 24002,
            web3Endpoint: "http://127.0.0.1:8502",
            LoyaltyTokenAddress: "0xB1A90a5C6e30d64Ab6f64C30eD392F46eDBcb022",
            LoyaltyBridgeAddress: "0x6Cc73CF62cF489973B41EAA94B857f36918Adee3",
            InnerChainBridgeAddress: "0x0F31212e5C9b698cf6BDbF5e5f1F5917b5e002cc",
            OuterChainBridgeAddress: "0x4d838836e0EcE05a2CFb016C8e60534D8AE53C40"
        },
        outer: {
            network: 24004,
            web3Endpoint: "http://127.0.0.1:8504",
            LoyaltyTokenAddress: "0x173A004aCf3aF9ccc0785346F17733eA33f65BB9",
            OuterChainBridgeAddress: "0x6Cc73CF62cF489973B41EAA94B857f36918Adee3"
        },
        relayEndpoint: "http://localhost:7070/"
    }
};

export const ADDITIONAL_NETWORKS: Network[] = [
    {
        name: SupportedNetwork.MAIN_GROUP_SIDE,
        chainId: 215120
    },
    {
        name: SupportedNetwork.MAIN_GROUP_MAIN,
        chainId: 2151
    },
    {
        name: SupportedNetwork.MAIN_GROUP_OUTER,
        chainId: 56
    },
    {
        name: SupportedNetwork.TEST_GROUP_SIDE,
        chainId: 215125
    },
    {
        name: SupportedNetwork.TEST_GROUP_MAIN,
        chainId: 2019
    },
    {
        name: SupportedNetwork.TEST_GROUP_OUTER,
        chainId: 97
    },
    {
        name: SupportedNetwork.DEV_GROUP_SIDE,
        chainId: 24000
    },
    {
        name: SupportedNetwork.DEV_GROUP_MAIN,
        chainId: 24002
    },
    {
        name: SupportedNetwork.DEV_GROUP_OUTER,
        chainId: 24004
    }
];
