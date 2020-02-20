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
        const user = data.users.find((user) => user.id === args.id)

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
}

export { Mutation as default}