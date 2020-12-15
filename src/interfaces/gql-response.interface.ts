export interface GqlResponse {
    // data
    readonly data?: any;

    //  graphql errors/resolver errors
    readonly errors?: any[];
}
