import { JsonRpcProvider } from "@ethersproject/providers";
import { IClientRelayCore } from "../interfaces/core";
import { Context } from "../context";
import { InternalServerError, NoRelayEndpointError } from "../../utils/errors";
import { IChainInfo } from "../../interfaces";
import { Network } from "../interfaces/network";

import { BigNumber } from "@ethersproject/bignumber";

const relayEndpointMap = new Map<RelayModule, string>();
const outerChainInfoMap = new Map<RelayModule, IChainInfo>();
const mainChainInfoMap = new Map<RelayModule, IChainInfo>();
const sideChainInfoMap = new Map<RelayModule, IChainInfo>();

export class RelayModule implements IClientRelayCore {
    constructor(context: Context) {
        if (context.relayEndpoint) {
            relayEndpointMap.set(this, context.relayEndpoint);
        }

        Object.freeze(RelayModule.prototype);
        Object.freeze(this);
    }

    private get relayEndpoint(): string | undefined {
        return relayEndpointMap.get(this);
    }

    /**
     * 릴레이 서버의 주소를 이용하여 엔드포인트를 생성한다
     * @param path 경로
     * @return {Promise<URL>} 엔드포인트의 주소
     */
    public async getEndpoint(path: string): Promise<URL> {
        if (!path) throw Error("Not path");
        const endpoint = this.relayEndpoint;
        if (endpoint === undefined) throw new NoRelayEndpointError();

        const newUrl = typeof endpoint === "string" ? new URL(endpoint) : endpoint;
        if (newUrl && !newUrl?.pathname.endsWith("/")) {
            newUrl.pathname += "/";
        }
        return new URL(path, newUrl);
    }

    /**
     * 릴레이 서버가 정상적인 상태인지 검사한다.
     * @return {Promise<boolean>} 이 값이 true 이면 릴레이 서버가 정상이다.
     */
    public async isUp(): Promise<boolean> {
        try {
            const res = await Network.get(await this.getEndpoint("/"));
            return res === "OK";
        } catch {
            return false;
        }
    }

    public async getNonceOfLedger(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/ledger/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    public async getNonceOfShop(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/shop/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    public async getNonceOfPhoneLink(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/link/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    private get outerChainInfo(): IChainInfo | undefined {
        return outerChainInfoMap.get(this);
    }

    private get mainChainInfo(): IChainInfo | undefined {
        return mainChainInfoMap.get(this);
    }

    private get sideChainInfo(): IChainInfo | undefined {
        return sideChainInfoMap.get(this);
    }

    // region Outer Chain

    /**
     * 메인체인의 정보를 제공한다.
     */
    public async getChainInfoOfOuterChain(): Promise<IChainInfo> {
        if (this.outerChainInfo !== undefined) return this.outerChainInfo;
        const res = await Network.get(await this.getEndpoint(`/v3/chain/outer/info`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        const chainInfo = {
            url: res.data.url,
            network: {
                name: res.data.network.name,
                chainId: res.data.network.chainId,
                ensAddress: res.data.network.ensAddress,
                chainTransferFee: BigNumber.from(res.data.network.chainTransferFee),
                loyaltyTransferFee: BigNumber.from(res.data.network.loyaltyTransferFee),
                loyaltyBridgeFee: BigNumber.from(res.data.network.loyaltyBridgeFee),
                innerChainBridgeFee: BigNumber.from(res.data.network.innerChainBridgeFee),
                outerChainBridgeFee: BigNumber.from(res.data.network.outerChainBridgeFee)
            },
            contract: {
                token: res.data.contract.token,
                loyaltyBridge: res.data.contract.loyaltyBridge,
                innerChainBridge: res.data.contract.innerChainBridge,
                outerChainBridge: res.data.contract.outerChainBridge
            }
        };
        outerChainInfoMap.set(this, chainInfo);
        return chainInfo;
    }

    /**
     * Outer 체인의 체인아이디를 제공한다.
     */
    public async getChainIdOfOuterChain(): Promise<number> {
        const chainInfo = await this.getChainInfoOfOuterChain();
        return Number(chainInfo.network.chainId);
    }

    /**
     * Outer 체인의 Provider를 제공한다.
     */
    public async getProviderOfOuterChain(): Promise<JsonRpcProvider> {
        const chainInfo = await this.getChainInfoOfOuterChain();
        const url = new URL(chainInfo.url);
        return new JsonRpcProvider(url.href, {
            name: chainInfo.network.name,
            chainId: chainInfo.network.chainId,
            ensAddress: chainInfo.network.ensAddress
        });
    }

    /**
     * Outer 체인의 토큰잔고를 제공한다.
     */
    public async getBalanceOfOuterChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/outer/balance/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        return BigNumber.from(res.data.balance);
    }

    // region Main Chain

    /**
     * 메인체인의 정보를 제공한다.
     */
    public async getChainInfoOfMainChain(): Promise<IChainInfo> {
        if (this.mainChainInfo !== undefined) return this.mainChainInfo;
        const res = await Network.get(await this.getEndpoint(`/v3/chain/main/info`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        const chainInfo = {
            url: res.data.url,
            network: {
                name: res.data.network.name,
                chainId: res.data.network.chainId,
                ensAddress: res.data.network.ensAddress,
                chainTransferFee: BigNumber.from(res.data.network.chainTransferFee),
                loyaltyTransferFee: BigNumber.from(res.data.network.loyaltyTransferFee),
                loyaltyBridgeFee: BigNumber.from(res.data.network.loyaltyBridgeFee),
                innerChainBridgeFee: BigNumber.from(res.data.network.innerChainBridgeFee),
                outerChainBridgeFee: BigNumber.from(res.data.network.outerChainBridgeFee)
            },
            contract: {
                token: res.data.contract.token,
                loyaltyBridge: res.data.contract.loyaltyBridge,
                innerChainBridge: res.data.contract.innerChainBridge,
                outerChainBridge: res.data.contract.outerChainBridge
            }
        };
        mainChainInfoMap.set(this, chainInfo);
        return chainInfo;
    }

    /**
     * 메인체인의 체인아이디를 제공한다.
     */
    public async getChainIdOfMainChain(): Promise<number> {
        const chainInfo = await this.getChainInfoOfMainChain();
        return Number(chainInfo.network.chainId);
    }

    /**
     * 메인체인의 Provider를 제공한다.
     */
    public async getProviderOfMainChain(): Promise<JsonRpcProvider> {
        const chainInfo = await this.getChainInfoOfMainChain();
        const url = new URL(chainInfo.url);
        return new JsonRpcProvider(url.href, {
            name: chainInfo.network.name,
            chainId: chainInfo.network.chainId,
            ensAddress: chainInfo.network.ensAddress
        });
    }

    /**
     * 메인체인의 토큰의 Nonce를 제공한다.
     */
    public async getNonceOfMainChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/main/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    /**
     * 메인체인의 토큰잔고를 제공한다.
     */
    public async getBalanceOfMainChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/main/balance/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        return BigNumber.from(res.data.balance);
    }

    // region Side Chain

    /**
     * 사이드체인의 정보를 제공한다.
     */
    public async getChainInfoOfSideChain(): Promise<IChainInfo> {
        if (this.sideChainInfo !== undefined) return this.sideChainInfo;
        const res = await Network.get(await this.getEndpoint(`/v3/chain/side/info`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        const chainInfo = {
            url: res.data.url,
            network: {
                name: res.data.network.name,
                chainId: res.data.network.chainId,
                ensAddress: res.data.network.ensAddress,
                chainTransferFee: BigNumber.from(res.data.network.chainTransferFee),
                loyaltyTransferFee: BigNumber.from(res.data.network.loyaltyTransferFee),
                loyaltyBridgeFee: BigNumber.from(res.data.network.loyaltyBridgeFee),
                innerChainBridgeFee: BigNumber.from(res.data.network.innerChainBridgeFee),
                outerChainBridgeFee: BigNumber.from(res.data.network.outerChainBridgeFee)
            },
            contract: {
                token: res.data.contract.token,
                loyaltyBridge: res.data.contract.loyaltyBridge,
                innerChainBridge: res.data.contract.innerChainBridge,
                outerChainBridge: res.data.contract.outerChainBridge
            }
        };
        sideChainInfoMap.set(this, chainInfo);
        return chainInfo;
    }

    /**
     * 사이드체인의 체인아이디를 제공한다.
     */
    public async getChainIdOfSideChain(): Promise<number> {
        const chainInfo = await this.getChainInfoOfSideChain();
        return Number(chainInfo.network.chainId);
    }

    /**
     * 사이드체인의 Provider 를 제공한다.
     */
    public async getProviderOfSideChain(): Promise<JsonRpcProvider> {
        const chainInfo = await this.getChainInfoOfSideChain();
        const url = new URL(chainInfo.url);
        return new JsonRpcProvider(url.href, {
            name: chainInfo.network.name,
            chainId: chainInfo.network.chainId,
            ensAddress: chainInfo.network.ensAddress
        });
    }

    /**
     * 사이드체인의 토큰의 Nonce 를 제공한다.
     */
    public async getNonceOfSideChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/side/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    /**
     * 사이드체인의 토큰 잔고를 제공한다.
     */
    public async getBalanceOfSideChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/side/balance/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        return BigNumber.from(res.data.balance);
    }
}
