
export const data = {

    users: [{
        id: '1',
        name: 'Bob',
        email: 'bob@example.com'
    },
    {
        id: '2',
        name: 'John',
        email: 'john@example.com'
    },
    {
        id: '3',
        name: 'Kay',
        email: 'kay@example.com'
    }],

    posts: [{
        id: '1',
        title: 'GraphQL Queries',
        body: '',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'GraphQL Mutations',
        body: '',
        published: false,
        author: '1'
    },
    {
        id: '3',
        title: 'GraphQL Subscriptions',
        body: '',
        published: false,
        author: '3'
    }],

    comments: [{
        id: '1',
        text: 'Thank you for writing this article',
        author: '2',
        post: '1'
    },
    {
        id: '2',
        text: 'Part 2 of GraphQL Queries will be up soon!',
        author: '1',
        post: '1'
    },
    {
        id: '3',
        text: 'Test comment',
        author: '2',
        post: '1'
    },
    {
        id: '4',
        text: 'Please feel free to ask any questions below',
        author: '3',
        post: '3'
    }]
}