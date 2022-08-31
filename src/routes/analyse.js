const Boom = require("@hapi/boom");
const { UrlAnalyser, generateAnalyseReport } = require("../lib/urlAnalyse");
const { requestScheme, responseSchemes } = require('../schemes/analyse');

async function response(request, h) {
    const {urls, ...analyseConfig} = request.payload;

    // if (!urls) {
    //     throw Boom.badRequest('urls for urlAnalyse in body not found');
    // }
    //
    // if (!Array.isArray(urls)) {
    //     throw Boom.badRequest("urls isn't array");
    // }

    const urlAnalyser = new UrlAnalyser(analyseConfig);

    const { results, errors } = await urlAnalyser.analyseUrls(urls);
    const dataTransformer = urlAnalyser.dataTransformer;

    const docBinary = await generateAnalyseReport(results, errors, dataTransformer);

    const filename = 'results.pdf'
    return h.response(docBinary)
        .type('application/pdf')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', `attachment;filename=${filename}`);
}

module.exports = {
    method: 'POST',
    path: '/urlAnalyse',
    handler: response,
    options: {
        validate: requestScheme,
        tags: ['api'],
        description: 'analyse urls',
        notes: 'returns pdf file with results',
        plugins: {
            'hapi-swagger': {
                responses: responseSchemes,
                produces: ['application/pdf', 'application/json']
            }
        }
    }

}