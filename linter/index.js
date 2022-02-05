module.exports = { 
    rules: {
        "graphql-authorized": require("./graphql-authorized"),
        "graphql-deferred-auth": require("./graphql-deferred-auth"),
        "graphql-cache": require("./graphql-cache"),
        "prisma-laziness": require("./prisma-laziness")
    }
};