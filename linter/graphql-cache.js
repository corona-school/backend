module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "If a Query is cached with @PublicCache then it must be accessible by anyone",
            category: "Lernfair Rule",
            recommended: true,
            url: "https://github.com/corona-school/backend/tree/master/linter"
        }
    },
    create(context) {
        let inResolver = false;

        return {
            "ClassDeclaration": function(classNode) {
                inResolver = classNode.decorators?.some(it => it.expression.callee.name === "Resolver");
            },
            "ClassDeclaration:exit": function(classNode) {
                inResolver = false;
            },
            "MethodDefinition": function(methodNode) {
                if (!inResolver) {
                    return;
                }

                const publicCache = methodNode.decorators?.some(it => it.expression.callee.name === "PublicCache");
                if (!publicCache)
                    return;

                const authorizationCheck = methodNode.decorators?.find(it => it.expression.callee.name === "Authorized" || it.expression.callee.name === "AuthorizedDeferred");
                if(!authorizationCheck)
                    return;

                const everyoneCanSee = authorizationCheck.expression.arguments.some(it => 
                    it.type === "MemberExpression" &&
                    it.object?.name === "Role" &&
                    it.property?.name === "UNAUTHENTICATED");

                if(publicCache && !everyoneCanSee) {
                    context.report({ 
                        node: methodNode.key,
                        message: `If a Query is cached with @PublicCache then it must be accessible by anyone`,
                    });
                }
            }
        };
    }
};