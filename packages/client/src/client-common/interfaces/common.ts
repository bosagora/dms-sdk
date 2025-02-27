export enum SupportedNetwork {
    KIOS_MAINNET = "kios_mainnet",
    KIOS_TESTNET = "kios_testnet",
    KIOS_DEVNET = "kios_devnet",
    LOCAL = "localhost"
}

export const SupportedNetworkArray = Object.values(SupportedNetwork);

export type NetworkDeployment = {
    PhoneLinkCollectionAddress: string;
    LoyaltyTokenAddress: string;
    ValidatorAddress: string;
    CurrencyRateAddress: string;
    ShopAddress: string;
    LedgerAddress: string;
    LoyaltyProviderAddress: string;
    LoyaltyConsumerAddress: string;
    LoyaltyExchangerAddress: string;
    LoyaltyTransferAddress: string;
    LoyaltyBridgeAddress: string;
    network: number;
    web3Endpoint: string;
    relayEndpoint: string;
};
export type GenericRecord = Record<string, string | number | boolean | null | undefined>;
