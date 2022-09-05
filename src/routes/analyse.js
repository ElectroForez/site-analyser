const { SiteAnalyser, generateAnalyseReport } = require("../lib/siteAnalyse");
const { analyse } = require('../schemes');
const Boom = require("@hapi/boom");

async function response(request, h) {
    const {urls, pdf, analyse} = request.payload;

    const siteAnalyser = new SiteAnalyser(analyse);

    const results = await siteAnalyser.analyseFromUrls(urls);

    const docBinary = await generateAnalyseReport(results, pdf)
        .catch(error => {throw Boom.badRequest(error.toString())});

    const attachFilename = 'results.pdf';

    return h.response(docBinary)
        .type('application/pdf')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', `attachment;filename=${attachFilename}`);
}

module.exports = {
    method: 'POST',
    path: '/siteAnalyse',
    handler: response,
    options: {
        validate: analyse.requestScheme,
        tags: ['api'],
        description: 'analyse urls content',
        notes: 'returns pdf file with results',
        plugins: {
            'hapi-swagger': {
                responses: analyse.responseSchemes,
                produces: ['application/pdf', 'application/json']
            }
        }
    }

}