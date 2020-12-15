import { ApolloLink, Observable, Operation } from "apollo-link";
import { GraphqlGrpcClient } from "../client/GraphqlGrpcClient";
import { GqlRequest } from "../interfaces/gql-request.interface";
import { print } from "graphql/language/printer";
export interface Options {
    /**
     * gRpc server endpoint
     */
    endpoint: string;

    /**
     * Request context decorator (Context middleware)
     */
    ctxDecorator?: <TContext = any>(req: GqlRequest) => TContext;
}

function mapToGqlRequest(operation: Operation): GqlRequest {
    const { operationName, extensions, variables, query } = operation;
    const request = print(query);

    return {
        context: operation.getContext(),
        request: request,
        variableValues: variables,
        extensions,
        opname: operationName,
    };
}


export const createGrpcLink = (options: Options) => {
    const client = new GraphqlGrpcClient(options.endpoint);
    return new ApolloLink(operation => {
        const req = mapToGqlRequest(operation);

        if (options.ctxDecorator) {
            options.ctxDecorator(req);
        }

        return new Observable(observer => {
            client
                .request(req)
                .then(response => {
                    operation.setContext({ response });
                    return response;
                })
                .then(result => {
                    // we have data and can send it to back up the link chain
                    observer.next(result);
                    observer.complete();
                    return result;
                })
                .catch(err => {
                    if (err.name === "AbortError") return;

                    if (err.result && err.result.errors && err.result.data) {

                        observer.next(err.result);
                    }
                    observer.error(err);
                });
        });
    });
};
