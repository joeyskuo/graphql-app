import { GraphQLServer } from 'graphql-yoga';

// Type definition ( schema )
const typeDefs = `
    type Query {
        hello: String!
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`

// Resolvers
const resolvers = {
    Query: {
        hello() {
            return 'Hello GraphQL!'
        },
        name() {
            return 'GraphQL 4000'
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('Server started!')
})