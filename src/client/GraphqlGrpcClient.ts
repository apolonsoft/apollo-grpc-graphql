import { GqlRequest } from "../interfaces/gql-request.interface";
import {  GqlResponse } from "../interfaces/gql-response.interface";
import path from "path";
import grpc from "grpc";
import { deserialize } from "../utils/serialization";

const PROTO_PATH = path.join(__dirname, "../protos/graphql.proto");

const protoDef = require("@grpc/proto-loader").loadSync(PROTO_PATH);
const { yb } = grpc.loadPackageDefinition(protoDef);
const clients: Map<string, any> = new Map<string, any>();

export class GraphqlGrpcClient {
    constructor(private readonly endpoint: string) {}

    private getClient(endpoint: string) {
        if (clients.has(endpoint)) {
            return clients.get(endpoint);
        }
        const client = new yb["GraphqlService"](
            endpoint,
            grpc.credentials.createInsecure()
        );
        clients.set(endpoint, client);
        return client;
    }

    /**
     *
     * @param req request payload
     */
    public request(req: GqlRequest) {
        const client = this.getClient(this.endpoint);

        return new Promise<GqlResponse>((resolve, reject) => {
            client.process(req, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    const result = {
                        data: deserialize(response.data),
                        errors: deserialize(response.errors) as any[],
                    };
                    resolve(result);
                }
            });
        });
    }
}
