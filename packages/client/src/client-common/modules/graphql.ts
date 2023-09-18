import { ClientNotInitializedError, GraphQLError, NoNodesAvailableError, runAndRetry } from "dms-sdk-common";
import { ClientError, GraphQLClient } from "graphql-request";
import { Context } from "../../client-common/context";
import { QueryStatus } from "../graphql-queries";
import { IClientGraphQLCore } from "../interfaces/core";

export class GraphqlModule implements IClientGraphQLCore {
    private clientIdx: number = -1;
    private clients: GraphQLClient[] = [];
    constructor(context: Context) {
        if (context.graphql?.length) {
            this.clients = context.graphql;
            this.clientIdx = Math.floor(Math.random() * context.graphql.length);
        }
    }
    /**
     * Get the current graphql client
     * @returns {GraphQLClient}
     */
    public getClient(): GraphQLClient {
        if (!this.clients.length) {
            throw new ClientNotInitializedError("graphql");
        }
        return this.clients[this.clientIdx];
    }

    /**
     * Starts using the next available Graphql endpoint
     * @returns {void}
     */
    public shiftClient(): void {
        if (!this.clients.length) {
            throw new ClientNotInitializedError("graphql");
        } else if (this.clients.length < 2) {
            throw new NoNodesAvailableError("graphql");
        }
        this.clientIdx = (this.clientIdx + 1) % this.clients.length;
    }

    /**
     * Checks if the current node is online
     * @returns {Promise<boolean>}
     */
    public isUp(): Promise<boolean> {
        return this.getClient()
            .request(QueryStatus)
            .then((res) => {
                return !!res._meta?.deployment;
            })
            .catch(() => {
                return false;
            });
    }

    /**
     * Ensures that the graphql is online.
     * If the current node is not online
     * it will shift to the next one and
     * repeat until it finds an online
     * node. In the case that there are no
     * nodes or none of them is available
     * it will throw an error
     * @returns {Promise<void>}
     */
    public async ensureOnline(): Promise<void> {
        if (!this.clients.length) {
            throw new ClientNotInitializedError("graphql");
        }
        for (let i = 0; i < this.clients.length; i++) {
            if (await this.isUp()) return;
            this.shiftClient();
        }
        throw new NoNodesAvailableError("graphql");
    }

    public request({ query, params, name }: { query: string; params: { [key: string]: any }; name?: string }) {
        if (!this.clients.length) {
            throw new ClientNotInitializedError("graphql");
        }
        let retries = this.clients.length;
        return runAndRetry({
            func: () => this.getClient().request(query, params),
            onFail: (e: Error) => {
                if (e instanceof ClientError) {
                    // If the error code is not a 5XX means the
                    // error is not generated by the server
                    if (e.response.status < 500) {
                        throw new GraphQLError(name || "");
                    }
                }
                retries--;
                this.shiftClient();
            },
            shouldRetry: () => retries > 0
        });
    }
}
