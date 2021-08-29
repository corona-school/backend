# ESLint Extensions for the Backend

To ensure some patterns (e.g. concerning security) are used across the codebase, 
 this folder contains some ESLint rules locally as described [here](https://stevenpetryk.com/blog/custom-eslint-rules/). 

 ## lernfair-lint/graphql-authorized

 This rule ensures that all GraphQL Resolvers are annotated with @Authorized, 
  so that nobody forgets about adding authorization checks. 