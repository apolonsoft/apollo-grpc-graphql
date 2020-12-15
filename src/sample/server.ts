import { GraphqlGrpcServer } from "../server/GraphqlGrpcServer";
import { schema, typeDefs, resolvers } from "./mySchema";

(async () => {
    await new GraphqlGrpcServer({
        endpoint: "localhost:50051",
        schema,
    }).start();
})();
