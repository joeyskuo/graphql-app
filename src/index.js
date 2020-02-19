import { GraphQLServer } from 'graphql-yoga';
import { data } from './dummyData';
import uuidv4 from 'uuid/v4';

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
        users(parent, args, { data }, info) {
            if(!args.query) {
                return data.users;
            }

            return data.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, { data }, info) {
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
        createUser(parent, args, { data }, info) {
            const emailTaken = data.users.some((user) => user.email === args.input.email)

            if(emailTaken) {
                throw new Error('Email already exists.')
            }

            const user = {
                id: uuidv4(),
                ...args.input
            }

            data.users.push(user)

            return user
        },
        deleteUser(parent, args, { data }, info) {
            const userIndex = data.users.findIndex((user) => user.id === args.id);

            if(userIndex === -1) {
                throw new Error('User not found.')
            }

            // remove target user
            const targetUser = data.users.splice(userIndex, 1);

            // delete all authored posts and their comments
            data.posts = data.posts.filter((post) => {

                const match = post.author === args.id

                if(match) {
                    data.comments = data.comments.filter((comment) => comment.author !== post.id)
                }

                return !match

            })

            // delete all authored comments
            data.comments = data.comments.filter((comment) => comment.author !== args.id)


            return targetUser[0];
        },
        createPost(parent, args, { data }, info) {
            const userExists = data.users.some((user) => user.id === args.input.author);

            if(!userExists) {
                throw new Error('User not found.')
            }

            const post = {
                id: uuidv4(),
                ...args.input
            }

            data.posts.push(post)

            return post
        },
        deletePost(parent, args, { data }, info) {
            const postIndex = data.posts.findIndex((post) => post.id === args.id);

            if(postIndex === -1) {
                throw new Error('Post not found.')
            }

            // remove target post
            const targetPost = data.posts.splice(postIndex, 1);

            // delete comments associated with post
            data.comments = data.comments.filter((comment) => comment.post !== args.id)

            return targetPost[0];
        },
        createComment(parent, args, { data }, info) {
            const userExists = data.users.some((user) => user.id === args.input.author);
            const postExists = data.posts.some((post) => post.id === args.input.post);

            if(!userExists) {
                throw new Error('User not found.')
            }
            if(!postExists) {
                throw new Error('Post not found.')
            }

            const comment = {
                id: uuidv4(),
                ...args.input
            }

            data.comments.push(comment)

            return comment
        },
        deleteComment(parent, args, { data }, info) {
            const commentIndex = data.comments.findIndex((comment) => comment.id === args.id);

            if(commentIndex === -1) {
                throw new Error('Comment not found.')
            }

            // remove target post
            const targetComment = data.comments.splice(commentIndex, 1);

            return targetComment[0];
        }
    },
    Post: {
        author(parent, args, { data }, info) {
            return data.users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, { data }, info) {
            return data.comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, args, { data }, info) {
            return data.posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, { data }, info) {
            return data.comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, { data }, info) {
            return data.users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, { data }, info) {
            return data.posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers,
    context: {
        data
    }
})

server.start(() => {
    console.log('Server started!')
})