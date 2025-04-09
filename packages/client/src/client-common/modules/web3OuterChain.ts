import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";
import { Contract, ContractInterface } from "@ethersproject/contracts";
import { Signer } from "@ethersproject/abstract-signer";
import { IClientWeb3OuterCore } from "../interfaces/core";
import { OuterContext } from "../context";
import { NoTokenAddress, NoNetwork, NoOuterChainBridgeAddress } from "../../utils/errors";

import { UnsupportedNetworkError } from "kios-sdk-common-v2";

const networkMap = new Map<Web3OuterChainModule, Networkish>();
const providersMap = new Map<Web3OuterChainModule, JsonRpcProvider>();
const signerMap = new Map<Web3OuterChainModule, Signer>();

const tokenAddressMap = new Map<Web3OuterChainModule, string>();
const outerChainBridgeAddressMap = new Map<Web3OuterChainModule, string>();

export class Web3OuterChainModule implements IClientWeb3OuterCore {
    constructor(context: OuterContext) {
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

        if (context.outerChainBridgeAddress) {
            outerChainBridgeAddressMap.set(this, context.outerChainBridgeAddress);
        }

        Object.freeze(Web3OuterChainModule.prototype);
        Object.freeze(this);
    }

    private get network(): Networkish | undefined {
        return networkMap.get(this);
    }

    private get tokenAddress(): string {
        return tokenAddressMap.get(this) || "";
    }

    private get outerChainBridgeAddress(): string {
        return outerChainBridgeAddressMap.get(this) || "";
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

    public getOuterChainBridgeAddress(): string {
        if (!this.outerChainBridgeAddress) {
            throw new NoOuterChainBridgeAddress();
        }
        return this.outerChainBridgeAddress;
    }
}
