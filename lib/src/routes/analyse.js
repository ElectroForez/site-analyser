import Boom from "@hapi/boom";
import SiteAnalyser from "../util/siteAnalyse/SiteAnalyser";
import generateAnalyseReport from "../util/siteAnalyse/generateAnalyseReport";
import * as schemes from '../schemes';
async function response(request, h) {
    const payload = request.payload;
    const urls = payload.urls;
    const pdf = payload.pdf;
    const analyse = payload.analyse;
    const siteAnalyser = new SiteAnalyser(analyse);
    const results = await siteAnalyser.analyseFromUrls(urls);
    const docBinary = await generateAnalyseReport(results, pdf)
        .catch((error) => { throw Boom.badRequest(error.toString()); });
    const attachFilename = 'results.pdf';
    return h.response(docBinary)
        .type('application/pdf')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', `attachment;filename=${attachFilename}`);
}
export const route = {
    method: 'POST',
    path: '/siteAnalyse',
    handler: response,
    options: {
        validate: schemes.analyse.requestScheme,
        tags: ['api'],
        description: 'analyse urls content',
        notes: 'returns pdf file with results',
        plugins: {
            'hapi-swagger': {
                responses: schemes.analyse.responseSchemes,
                produces: ['application/pdf', 'application/json']
            }
        }
    }
};
