const Post = {
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
}

export { Post as default}