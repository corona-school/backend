module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "If a method is annotated with @AuthorizedDeferred, it must call and await hasAccess",
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

                const deferredAuth = methodNode.decorators?.some(it => it.expression.callee.name === "AuthorizedDeferred");

                if(!deferredAuth) {
                    return;
                }

                const authorizationCheck = methodNode.value.body.body.some(statement => 
                    statement.type === "ExpressionStatement" && 
                    statement.expression.type === "AwaitExpression" &&
                    statement.expression.argument.type === "CallExpression" &&
                    statement.expression.argument.callee.name === "hasAccess"
                );
                
                
                if(!authorizationCheck) {
                    context.report({ 
                        node: methodNode.key,
                        message: `await hasAccess(...) check missing for Method ${methodNode.key.name} in a Resolver with @AuthorizedDeferred`, 
                    });
                }
            }
        };
    }
};