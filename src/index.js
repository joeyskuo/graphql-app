import { GraphQLServer } from 'graphql-yoga'
import { data } from './dummyData'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    context: {
        data
    }
})

server.start(() => {
    console.log('Server started!')
})