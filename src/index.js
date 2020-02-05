import { GraphQLServer } from 'graphql-yoga';
import { data } from './dummyData';

// Type definition ( schema )
const typeDefs = `
    type Query {
        me: User!
        users: [User!]!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        me() {
            return {
                id: '123098',
                name: 'John',
                email: 'john@example.com',
                age: null
            }
        },
        users(parent, args, ctx, info) {
            return data.users
        },
        post() {
            return {
                id: '099',
                title: 'GraphQL APIs',
                body: '',

            }
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