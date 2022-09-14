import Hapi from "@hapi/hapi";
import Boom from "@hapi/boom";

async function response(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    throw Boom.notFound('OOOPS! Resource not found');
}

export const route: Hapi.ServerRoute = {
    method: '*',
    path: '/{any*}',
    handler: response
}
