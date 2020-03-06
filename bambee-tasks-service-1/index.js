const serverless = require('serverless-http');
const server = require('./app');
const handler = serverless(server);

module.exports.server = async (event, context) => {
    console.log('EVENT', event);
    console.log('CONTEXT', context);
    context.callbackWaitsForEmptyEventLoop= false;

    return await handler(event, context);
};