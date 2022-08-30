const Boom = require("@hapi/boom");
const fetch = require("node-fetch");
const { analyseUrlContent, dataTransform } = require("../lib/analyse");
const PdfWriter = require("../lib/pdf");

async function response(request, h) {
    const urls = request.payload.urls;
    const ignoreRegister = request.payload.ignoreRegister || false;
    const results = {};
    const errors = {};

    if (!urls) {
        throw Boom.badRequest('urls for analyse in body not found');
    }

    if (!Array.isArray(urls)) {
        throw Boom.badRequest("urls isn't array");
    }

    for (const url of urls) {
        const response = await fetch(url)
            .catch(error => {
                switch (error.name) {
                    case 'TypeError':
                        errors[url] = "Некорректная ссылка";
                        break;
                    case 'FetchError':
                        errors[url] = "Недоступен";
                        break;
                    default:
                        errors[url] = error.toString();
                }
                console.error(error.toString())
            });

        if (!response) continue;

        if (!response.ok) {
            errors[url] = response.statusText;
            console.error(`${url} - ${errors[url]}`);
            continue
        }

        const urlContent = await response.text() || "";
        if (ignoreRegister) {
            results[url] = await analyseUrlContent(urlContent.toLowerCase());
        } else {
            results[url] = await analyseUrlContent(urlContent);
        }
    }

    const pdfWriter = new PdfWriter();

    if (!urls.length) {
        pdfWriter.insertSubHeader("Нету сайтов для анализа");
    }

    if (Object.keys(results).length) {
        pdfWriter.insertContentEl("\n");
        pdfWriter.insertSubHeader("Результаты анализа:");
        pdfWriter.insertTable(dataTransform.urlResultsToArray(results));
    }

    if (Object.keys(errors).length) {
        pdfWriter.insertContentEl("\n", {repeat: 4});
        pdfWriter.insertSubHeader("Ошибки:");
        pdfWriter.insertTable(dataTransform.urlErrorsToArray(errors));
    }

    const binary = await pdfWriter.getDocBinary();

    const filename = 'results.pdf'
    return h.response(binary)
        .type('application/pdf')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', `attachment;filename=${filename}`);
}

module.exports = {
    method: 'POST',
    path: '/analyse',
    handler: response
}