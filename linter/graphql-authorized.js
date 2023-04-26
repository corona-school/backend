module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Every method in a @Resolver must be annotated with @Authorized or @AuthorizedDeferred",
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

                const authorizationCheck = methodNode.decorators?.some(it => it.expression.callee.name === "Authorized" || it.expression.callee.name === "AuthorizedDeferred");

                if(!authorizationCheck) {
                    context.report({ 
                        node: methodNode.key,
                        message: `@Authorized or @AuthorizedDeferred missing for Method ${methodNode.key.name} in a Resolver`,
                        suggest: [
                            {
                                desc: `Add @Authorized annotation`,
                                fix(fixer) {
                                    return fixer.insertTextBefore(methodNode, "@Authorized(Role.ADMIN)\n")
                                }
                            },
                            {
                                desc: `Add @AuthorizedDeferred annotation`,
                                fix(fixer) {
                                    return fixer.insertTextBefore(methodNode, "@AuthorizedDeferred(Role.ADMIN)\n")
                                }
                            }
                        ],
                    });
                }
            }
        };
    }
};