import { GraphQLServer } from 'graphql-yoga';
import { data } from './dummyData';
import uuidv4 from 'uuid/v4';

// Type definition ( schema )
const typeDefs = `
    type Query {
        me: User!
        users(query: String): [User!]!
        post: Post!
        posts(query: String): [Post!]!
    }

    type Mutation {
        createUser(name: String!, email: String!): User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        me() {
            return {
                id: '123098',
                name: 'John',
                email: 'john@example.com'
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = data.users.some((user) => user.email === args.email)

            if(emailTaken) {
                throw new Error('Email already exists.')
            }

            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email
            }

            data.users.push(user)

            return user
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return data.users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return data.comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return data.posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return data.comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return data.users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return data.posts.find((post) => {
                return post.id === parent.post
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