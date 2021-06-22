export default function ApolloContext({ req }) {
    const token = req.headers.authorization || '';

    let roles = [];

    if (token === process.env.ADMIN_AUTH_TOKEN) {
        roles.push('ADMIN');
    }

    const user = { roles };

    return { user };
}