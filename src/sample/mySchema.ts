import { find, filter } from "lodash";
import { makeExecutableSchema } from "graphql-tools";

export const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }
  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }
  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

export const resolvers = {
    Query: {
        posts: () => posts,
        author: (_, { id }) => find(authors, { id: id }),
    },
    Mutation: {
        upvotePost: (_, { postId }) => {
            const post = find(posts, { id: postId });
            if (!post) {
                throw new Error(`Couldn't find post with id ${postId}`);
            }
            post.votes += 1;
            return post;
        },
    },
    Author: {
        posts: author => filter(posts, { authorId: author.id }),
    },
    Post: {
        author: post => find(authors, { id: post.authorId }),
    },
};

const authors = [
    { id: 1, firstName: "Ahmad", lastName: "MKH" },
    { id: 2, firstName: "Marco", lastName: "VB" },
    { id: 3, firstName: "Sara", lastName: "ASP" },
];

const posts = [
    { id: 1, authorId: 1, title: "Book 1", votes: 2 },
    { id: 2, authorId: 2, title: "Book 2", votes: 3 },
    { id: 3, authorId: 2, title: "Book 3", votes: 1 },
    { id: 4, authorId: 3, title: "Book 4", votes: 7 },
];

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
