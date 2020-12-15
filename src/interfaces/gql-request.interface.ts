export interface GqlRequest {
    // Operation name
    readonly opname?: string;

    // request (mutation/query/subscription)
    readonly request: string;

    // context (json)
    context?: object;

    // request variables (json)
    readonly variableValues?: { [key: string]: any };

    /**
     * Request extensions used for apollo compatibility
     */
    extensions?: any;
}
