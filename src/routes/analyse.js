const Boom = require("@hapi/boom");
const { UrlAnalyser, generateAnalyseReport } = require("../../lib/urlAnalyse");

async function response(request, h) {
    const {urls,
        ignoreRegister = false,
        wordsCount = 3,
        minWordLen = 3
    } = request.payload;

    if (!urls) {
        throw Boom.badRequest('urls for urlAnalyse in body not found');
    }

    if (!Array.isArray(urls)) {
        throw Boom.badRequest("urls isn't array");
    }

    const urlAnalyser = new UrlAnalyser({ignoreRegister, wordsCount, minWordLen});

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
    handler: response
}