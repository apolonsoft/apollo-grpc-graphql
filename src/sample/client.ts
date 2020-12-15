import { GraphqlGrpcClient } from "../client/GraphqlGrpcClient";

(async () => {
    const client = new GraphqlGrpcClient("localhost:50051");
    const result = await client.request({
        request: `query {
            posts {
              title
              author {id}
            }
          }`,
    });

    console.info("Result is \n" + JSON.stringify(result, null, 2));
})();
