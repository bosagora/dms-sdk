import {
    IClientCore,
    IClientRelayCore,
    IClientWeb3OuterCore,
    IClientWeb3MainCore,
    IClientWeb3SideCore
} from "./interfaces/core";
import { Context } from "./context";
import { Web3MainChainModule } from "./modules/web3MainChain";
import { Web3OuterChainModule } from "./modules/web3OuterChain";
import { Web3SideChainModule } from "./modules/web3SideChain";
import { RelayModule } from "./modules/relay";

const web3SideMap = new Map<ClientCore, IClientWeb3SideCore>();
const web3MainMap = new Map<ClientCore, IClientWeb3MainCore>();
const web3OuterMap = new Map<ClientCore, IClientWeb3OuterCore>();
const relayMap = new Map<ClientCore, IClientRelayCore>();

/**
 * Provides the low level foundation so that subclasses have ready-made access to Web3, IPFS and GraphQL primitives
 */
export abstract class ClientCore implements IClientCore {
    protected constructor(context: Context) {
        relayMap.set(this, new RelayModule(context));
        web3SideMap.set(this, new Web3SideChainModule(context.side));
        web3MainMap.set(this, new Web3MainChainModule(context.main));
        web3OuterMap.set(this, new Web3OuterChainModule(context.outer));
        Object.freeze(ClientCore.prototype);
    }

    get relay(): IClientRelayCore {
        return relayMap.get(this)!;
    }

    get web3(): IClientWeb3SideCore {
        return web3SideMap.get(this)!;
    }

    get web3Side(): IClientWeb3SideCore {
        return web3SideMap.get(this)!;
    }

    get web3Main(): IClientWeb3MainCore {
        return web3MainMap.get(this)!;
    }

    get web3Outer(): IClientWeb3OuterCore {
        return web3OuterMap.get(this)!;
    }
}
