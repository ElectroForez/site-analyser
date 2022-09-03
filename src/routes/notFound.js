const Boom = require('@hapi/boom');
async function response(request, h) {
    throw Boom.notFound('OOOPS! Resource not found');
}

module.exports = {
    method: '*',
    path: '/{any*}',
    handler: response
}
