import uuidv4 from 'uuid/v4'

const Mutation = {
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
    updateUser(parent, args, { data }, info) {
        const { id, input } = args
        const user = data.users.find((user) => user.id === id)

        if(!user) {
            throw new Error('User not found')
        }

        if(typeof input.email === 'string') {
            const emailTaken = data.users.some((user) => user.email === input.email)
            if(emailTaken) {
                throw new Error('Email already in use.')
            } 

            user.email = input.email
        }

        if(typeof input.name === 'string') {
            user.name = input.name
        }

        return user

    },
    createPost(parent, args, { data, pubsub }, info) {
        const userExists = data.users.some((user) => user.id === args.input.author);

        if(!userExists) {
            throw new Error('User not found.')
        }

        const post = {
            id: uuidv4(),
            ...args.input
        }

        data.posts.push(post)
        pubsub.publish('posts', { 
            post: {
                mutation: 'CREATED',
                data: post
            }
         })

        return post
    },
    deletePost(parent, args, { data, pubsub }, info) {
        const postIndex = data.posts.findIndex((post) => post.id === args.id);

        if(postIndex === -1) {
            throw new Error('Post not found.')
        }

        // remove target post
        const [targetPost] = data.posts.splice(postIndex, 1);

        // delete comments associated with post
        data.comments = data.comments.filter((comment) => comment.post !== args.id)

        if(targetPost.published) {

            pubsub.publish('posts', { 
                post: {
                    mutation: 'DELETED',
                    data: targetPost
                }
             })

        }

        return targetPost;
    },
    updatePost(parent, args, { data, pubsub }, info) {
        const { id, input } = args

        const post = data.posts.find((post) => post.id === id)
        const originalPost = {...post};

        if(!post) {
            throw new Error('Post not found.')
        }

        if(typeof input.title === 'string') {
            post.title = input.title
        }

        if(typeof input.body === 'string') {
            post.body = input.body
        }

        if(typeof input.published === 'boolean') {
            post.published = input.published

            if(originalPost.published && !post.published) {
                // deleted
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && post.published) {
                // created
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }

        } else if(post.published) {
            // updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { data, pubsub }, info) {
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
        pubsub.publish(`comment ${args.input.post}`, { 
            comment: {
                mutation: 'CREATED',
                data: comment
            }
         })

        return comment
    },
    deleteComment(parent, args, { data, pubsub }, info) {
        const commentIndex = data.comments.findIndex((comment) => comment.id === args.id);

        if(commentIndex === -1) {
            throw new Error('Comment not found.')
        }

        // remove target post
        const [targetComment] = data.comments.splice(commentIndex, 1);

        pubsub.publish(`comment ${targetComment.post}`, { 
            comment: {
                mutation: 'DELETED',
                data: targetComment
            }
         })

        return targetComment;
    },
    updateComment(parent, args, { data }, info) {
        const { id, input } = args

        const comment = data.comments.find((comment) => comment.id === id)

        if(!comment) {
            throw new Error('Comment not found.')
        }

        if(typeof input.text === 'string') {
            comment.text = input.text
        }

        return comment
    }
    
}

export { Mutation as default}