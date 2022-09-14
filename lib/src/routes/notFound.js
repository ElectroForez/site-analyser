import Boom from "@hapi/boom";
async function response(request, h) {
    throw Boom.notFound('OOOPS! Resource not found');
}
export const route = {
    method: '*',
    path: '/{any*}',
    handler: response
};
