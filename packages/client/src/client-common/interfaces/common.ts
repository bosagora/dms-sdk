export enum SupportedNetworkGroup {
    MAIN_GROUP = "main_group",
    TEST_GROUP = "test_group",
    DEV_GROUP = "dev_group"
}

export const SupportedNetworkGroupArray = Object.values(SupportedNetworkGroup);

export enum SupportedNetwork {
    MAIN_GROUP_SIDE = "main_group_side",
    TEST_GROUP_SIDE = "test_group_side",
    DEV_GROUP_SIDE = "dev_group_side",
    MAIN_GROUP_MAIN = "main_group_main",
    TEST_GROUP_MAIN = "test_group_main",
    DEV_GROUP_MAIN = "dev_group_main",
    MAIN_GROUP_OUTER = "main_group_outer",
    TEST_GROUP_OUTER = "test_group_outer",
    DEV_GROUP_OUTER = "dev_group_outer"
}

export const SupportedNetworkArray = Object.values(SupportedNetwork);

export type NetworkDeployment = {
    relayEndpoint: string;
    side: {
        network: number;
        web3Endpoint: string;
        LoyaltyTokenAddress: string;
        PhoneLinkCollectionAddress: string;
        ValidatorAddress: string;
        CurrencyRateAddress: string;
        ShopAddress: string;
        LedgerAddress: string;
        LoyaltyProviderAddress: string;
        LoyaltyConsumerAddress: string;
        LoyaltyExchangerAddress: string;
        LoyaltyTransferAddress: string;
        LoyaltyBridgeAddress: string;
        InnerChainBridgeAddress: string;
    };
    main: {
        network: number;
        web3Endpoint: string;
        LoyaltyTokenAddress: string;
        LoyaltyBridgeAddress: string;
        InnerChainBridgeAddress: string;
        OuterChainBridgeAddress: string;
    };
    outer: {
        network: number;
        web3Endpoint: string;
        LoyaltyTokenAddress: string;
        OuterChainBridgeAddress: string;
    };
};
export type GenericRecord = Record<string, string | number | boolean | null | undefined>;
