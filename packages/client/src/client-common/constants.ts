import { NetworkDeployment, SupportedNetwork } from "./interfaces/common";
import { activeContractsList } from "dms-contracts-lib-v2";
import { Network } from "@ethersproject/networks";

export const LIVE_CONTRACTS: { [K in SupportedNetwork]: NetworkDeployment } = {
    loyalty_mainnet: {
        PhoneLinkCollectionAddress: activeContractsList.loyalty_mainnet.PhoneLinkCollection,
        LoyaltyTokenAddress: activeContractsList.loyalty_mainnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.loyalty_mainnet.Validator,
        CurrencyRateAddress: activeContractsList.loyalty_mainnet.CurrencyRate,
        ShopAddress: activeContractsList.loyalty_mainnet.Shop,
        LedgerAddress: activeContractsList.loyalty_mainnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.loyalty_mainnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.loyalty_mainnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.loyalty_mainnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.loyalty_mainnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.loyalty_mainnet.LoyaltyBridge,
        network: 215150,
        web3Endpoint: "https://rpc.main.lyt.bosagora.org/",
        relayEndpoint: "https://relay.main.lyt.bosagora.org/"
    },
    loyalty_testnet: {
        PhoneLinkCollectionAddress: activeContractsList.loyalty_testnet.PhoneLinkCollection,
        LoyaltyTokenAddress: activeContractsList.loyalty_testnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.loyalty_testnet.Validator,
        CurrencyRateAddress: activeContractsList.loyalty_testnet.CurrencyRate,
        ShopAddress: activeContractsList.loyalty_testnet.Shop,
        LedgerAddress: activeContractsList.loyalty_testnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.loyalty_testnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.loyalty_testnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.loyalty_testnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.loyalty_testnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.loyalty_testnet.LoyaltyBridge,
        network: 215155,
        web3Endpoint: "https://rpc.test.lyt.bosagora.org/",
        relayEndpoint: "https://relay.test.lyt.bosagora.org/"
    },
    loyalty_devnet: {
        PhoneLinkCollectionAddress: activeContractsList.loyalty_devnet.PhoneLinkCollection,
        LoyaltyTokenAddress: activeContractsList.loyalty_devnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.loyalty_devnet.Validator,
        CurrencyRateAddress: activeContractsList.loyalty_devnet.CurrencyRate,
        ShopAddress: activeContractsList.loyalty_devnet.Shop,
        LedgerAddress: activeContractsList.loyalty_devnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.loyalty_devnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.loyalty_devnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.loyalty_devnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.loyalty_devnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.loyalty_devnet.LoyaltyBridge,
        network: 24680,
        web3Endpoint: "http://rpc-side.dev.lyt.bosagora.org:28545/",
        relayEndpoint: "http://relay.dev.lyt.bosagora.org:27070/"
    },
    localhost: {
        PhoneLinkCollectionAddress: activeContractsList.loyalty_devnet.PhoneLinkCollection,
        LoyaltyTokenAddress: activeContractsList.loyalty_devnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.loyalty_devnet.Validator,
        CurrencyRateAddress: activeContractsList.loyalty_devnet.CurrencyRate,
        ShopAddress: activeContractsList.loyalty_devnet.Shop,
        LedgerAddress: activeContractsList.loyalty_devnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.loyalty_devnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.loyalty_devnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.loyalty_devnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.loyalty_devnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.loyalty_devnet.LoyaltyBridge,
        network: 24680,
        web3Endpoint: "http://localhost:8545/",
        relayEndpoint: "http://localhost:7070/"
    }
};

export const ADDITIONAL_NETWORKS: Network[] = [
    {
        name: SupportedNetwork.LOYALTY_MAINNET,
        chainId: 215150
    },
    {
        name: SupportedNetwork.LOYALTY_TESTNET,
        chainId: 215155
    },
    {
        name: SupportedNetwork.LOYALTY_DEVNET,
        chainId: 24680
    }
];
