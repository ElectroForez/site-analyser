const Boom = require("@hapi/boom");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const {analyse, analyseResultToArray} = require("../lib/analyse");
const PdfWriter = require("../lib/pdf");

async function response(request, h) {
    const urls = request.payload.urls;
    const result = {};
    if (!urls) {
        throw Boom.badRequest('Urls for analyse in body not found');
    }

    for (const url of urls) {
        const response = await fetch(url)
            .catch(error => console.error(error.toString()));
        if (!response) {
            continue;
        }

        if (!response.ok) {
            console.log("bad status code from " + url);
            continue
        }

        const urlContent = await response.text();
        result[url] = await analyse(urlContent);
        fs.writeFileSync(path.join('documents', new URL(url).host + '.html'), urlContent);

        const pdfWriter = new PdfWriter();
        pdfWriter.insertTable(analyseResultToArray(result));
        pdfWriter.saveToPdf('documents/pdf/test.pdf');
    }
    return {message: analyseResultToArray(result)};
}

module.exports = {
    method: 'POST',
    path: '/analyse',
    handler: response
}