const Query = {
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
}

export { Query as default }