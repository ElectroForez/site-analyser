import Boom from "@hapi/boom";
import Hapi from '@hapi/hapi';
import SiteAnalyser, {AnalyseConfig} from "../util/siteAnalyse/SiteAnalyser";
import generateAnalyseReport, {GenerateOptions} from "../util/siteAnalyse/generateAnalyseReport";
import * as schemes from '../schemes';

async function response(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const payload: any = request.payload;

    const urls: string[] = payload.urls;
    const pdf: GenerateOptions = payload.pdf;
    const analyse: AnalyseConfig = payload.analyse;

    const siteAnalyser = new SiteAnalyser(analyse);

    const results = await siteAnalyser.analyseFromUrls(urls);

    const docBinary = await generateAnalyseReport(results, pdf)
        .catch((error: Error) => {throw Boom.badRequest(error.toString())});

    const attachFilename = 'results.pdf';

    return h.response(docBinary)
        .type('application/pdf')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', `attachment;filename=${attachFilename}`);
}

export const route: Hapi.ServerRoute = {
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

}