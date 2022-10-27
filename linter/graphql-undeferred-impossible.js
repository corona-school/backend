module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Mutations can only use Role.OWNER and Role.SUBCOURSE_PARTICIPANT in @AuthorizedDeferred',
            category: 'Lernfair Rule',
            recommended: true,
            url: 'https://github.com/corona-school/backend/tree/master/linter',
        },
    },
    create(context) {
        let inResolver = false;

        return {
            ClassDeclaration: function (classNode) {
                inResolver = classNode.decorators?.some((it) => it.expression.callee.name === 'Resolver');
            },
            'ClassDeclaration:exit': function (classNode) {
                inResolver = false;
            },
            MethodDefinition: function (methodNode) {
                if (!inResolver) {
                    return;
                }

                const isMutation = methodNode.decorators?.find((it) => it.expression.callee.name === 'Mutation');
                if (!isMutation) return;

                const undeferredAuth = methodNode.decorators?.find((it) => it.expression.callee.name === 'Authorized');

                if (!undeferredAuth) {
                    return;
                }

                const needsToBeDeferred = undeferredAuth.expression.arguments.some((it) => ['OWNER', 'SUBCOURSE_PARTICIPANT'].includes(it.property.name));

                if (needsToBeDeferred) {
                    context.report({
                        node: methodNode.key,
                        message: `Must use @AuthorizedDeferred for mutation ${methodNode.key.name}`,
                    });
                }
            },
        };
    },
};
