const Subscription = {
    comment: {
        subscribe(parent, { postId }, { data, pubsub }, info) {

            const post = data.posts.find((post) => post.id === postId)

            if(!post) {
                throw new Error('Post not found')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator(`posts`)
        }
    }
}

export { Subscription as default }