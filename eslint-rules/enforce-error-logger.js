module.exports = {
    rules: {
        'enforce-error-logger': {
            create: function(context) {
                return {
                    CallExpression(node) {
                        if (
                            node.callee.type === 'MemberExpression' &&
                            node.callee.object.type === 'Identifier' &&
                            node.callee.object.name === 'console' &&
                            (node.callee.property.name === 'error' || node.callee.property.name === 'warn')
                        ) {
                            const scope = context.getScope();
                            const errorLogger = scope.resolve('logError');
                            if (!errorLogger) {
                                context.report({
                                    node: node,
                                    message: 'Use logError instead of console.error or console.warn',
                                });
                            }
                        }
                    },
                };
            },
        },
    },
};