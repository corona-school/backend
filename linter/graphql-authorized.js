module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "",
            category: "Lernfair Rule",
            recommended: true,
            url: "https://github.com/corona-school/backend/tree/master/linter"
        },
        fixable: "code"
    },
    create(context) {
        let inResolver = false;

        return {
            "ClassDeclaration": function(classNode) {
                const isResolver = classNode.decorators.some(it => it.expression.expression.escapedText === "Resolver");
                console.log("Visiting Class", classNode, isResolver);
                if (isResolver) {
                    inResolver = true;
                }
            },
            "ClassDeclaration:exit": function(classNode) {
                inResolver = false;
            },
            "MethodDeclaration": function(methodNode) {
                if (!inResolver) {
                    return;
                }

                const authorizationCheck = methodNode.decorators.some(it => it.expression.expression.escapedText === "Authorized");

                console.log("Method in Resolver", methodNode, authorizationCheck);
            }
        };
    }
};