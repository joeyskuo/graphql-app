import { GraphQLServer } from 'graphql-yoga';
import { data } from './dummyData';

// Type definition ( schema )
const typeDefs = `
    type Query {
        me: User!
        users(query: String): [User!]!
        post: Post!
        posts(query: String): [Post!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
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
            if(!args.query) {
                return data.users;
            }

            return data.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return data.posts
            }

            return data.posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        post() {
            return {
                id: '099',
                title: 'GraphQL APIs',
                body: '',
                published: true
            }
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return data.users.find((user) => {
                return user.id === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return data.posts.filter((post) => {
                return post.author === parent.id
            })
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