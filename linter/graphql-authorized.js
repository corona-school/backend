module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Every method in a @Resolver must be annotated with @Authorized",
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
                if(inResolver)
                    console.log(classNode.body.body);
            },
            "ClassDeclaration:exit": function(classNode) {
                inResolver = false;
            },
            "MethodDefinition": function(methodNode) {
                if (!inResolver) {
                    return;
                }

                const authorizationCheck = methodNode.decorators?.some(it => it.expression.callee.name === "Authorized");

                if(!authorizationCheck) {
                    context.report({ 
                        node,
                        message: `@Authorized missing for Method ${methodNode.key.name}`,
                    });
                }
            }
        };
    }
};