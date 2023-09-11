export const SupportedNetworksArray = ["bosagora_mainnet", "bosagora_testnet", "bosagora_devnet", "localhost"] as const;
export type SupportedNetworks = typeof SupportedNetworksArray[number];
export type NetworkDeployment = {
    LinkCollection: string;
    Token: string;
    ValidatorCollection: string;
    TokenPrice: string;
    FranchiseeCollection: string;
    Ledger: string;
    relayEndpoint?: string | URL;
};
export type GenericRecord = Record<string, string | number | boolean | null | undefined>;
export interface IHttpConfig {
    /** IPFS Cluster URL */
    url: URL;
    /** Additional headers to be included with requests */
    headers?: Record<string, string>;
}
