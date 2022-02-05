const PRISMA_MUTATORS = ["create", "update", "upsert", "delete", "createMany", "updateMany", "deleteMany"];

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Every Prisma Query must be awaited",
            category: "Lernfair Rule",
            recommended: true,
            url: "https://github.com/corona-school/backend/tree/master/linter"
        }
    },
    create(context) {
        return {
            "CallExpression": function(callNode) {
                if (callNode.callee.type !== "MemberExpression") return;
                if (!PRISMA_MUTATORS.includes(callNode.callee.property.name)) return;
                if (callNode.callee.object?.object?.name !== "prisma") return;
                // prisma.[...].(create|...)( );

                if (callNode.parent.type !== "AwaitExpression") {
                    context.report({ 
                        node: callNode,
                        message: `The Prisma Query MUST be awaited to take effect`,
                    });
                }
            }, 
        };
    }
};