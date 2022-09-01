const Boom = require("@hapi/boom");
const { UrlAnalyser, generateAnalyseReport } = require("../lib/urlAnalyse");
const { requestScheme, responseSchemes } = require('../schemes/analyse');

async function response(request, h) {
    const {urls, ...analyseConfig} = request.payload;

    const urlAnalyser = new UrlAnalyser(analyseConfig);

    const { results, errors } = await urlAnalyser.analyseUrls(urls);
    const dataTransformer = urlAnalyser.dataTransformer;

    const docBinary = await generateAnalyseReport(results, errors, dataTransformer);

    const attachFilename = 'results.pdf';

    return h.response(docBinary)
        .type('application/pdf')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', `attachment;filename=${attachFilename}`);
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