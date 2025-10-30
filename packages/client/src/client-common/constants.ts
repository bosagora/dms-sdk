import { NetworkDeployment, SupportedNetwork } from "./interfaces/common";
import { activeContractsList } from "kios-contracts-lib-v2";
import { Network } from "@ethersproject/networks";

export const LIVE_CONTRACTS: { [K in SupportedNetwork]: NetworkDeployment } = {
    kios_mainnet: {
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
        network: 215120,
        web3Endpoint: "https://rpc-mainnet.kios.bosagora.com/",
        relayEndpoint: "https://relay-mainnet.kios.bosagora.com/"
    },
    kios_testnet: {
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
        network: 215125,
        web3Endpoint: "https://rpc-testnet.kios.bosagora.com/",
        relayEndpoint: "https://relay-testnet.kios.bosagora.com/"
    },
    kios_devnet: {
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
        network: 24680,
        web3Endpoint: "http://rpc-side.dev.kioscoin.io:28545/",
        relayEndpoint: "http://relay.dev.kioscoin.io:27070/"
    },
    localhost: {
        PhoneLinkCollectionAddress: "",
        LoyaltyTokenAddress: "",
        ValidatorAddress: "",
        CurrencyRateAddress: "",
        ShopAddress: "",
        LedgerAddress: "",
        LoyaltyProviderAddress: "",
        LoyaltyConsumerAddress: "",
        LoyaltyExchangerAddress: "",
        LoyaltyTransferAddress: "",
        LoyaltyBridgeAddress: "",
        network: 24680,
        web3Endpoint: "http://localhost:8545/",
        relayEndpoint: "http://localhost:7070/"
    }
};

export const ADDITIONAL_NETWORKS: Network[] = [
    {
        name: SupportedNetwork.KIOS_MAINNET,
        chainId: 215120
    },
    {
        name: SupportedNetwork.KIOS_TESTNET,
        chainId: 215125
    },
    {
        name: SupportedNetwork.KIOS_DEVNET,
        chainId: 24680
    }
];
