# ESLint Extensions for the Backend

To ensure some patterns (e.g. concerning security) are used across the codebase, 
 this folder contains some ESLint rules locally as described [here](https://stevenpetryk.com/blog/custom-eslint-rules/). 

To have a look at the AST, [ASTExplorer](https://astexplorer.net) can be used.
 ## lernfair-lint/graphql-authorized

 This rule ensures that all GraphQL Resolvers are annotated with @Authorized or @AuthorizedDeferred, 
  so that nobody forgets about adding authorization checks. 

## lernfair-lint/graphql-deferred-auth

Ensures that all GraphQL Resolvers annotated with @AuthorizedDeferred actually perform an authorization check by calling 
 `await hasAccess(...)`.

## lernfair-lint/graphql-cache

Ensures that every request annotated with @PublicCache does not have authorization requirements. 