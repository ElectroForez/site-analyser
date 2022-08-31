const { ReportWriter } = require("../pdf");

async function generateAnalyseReport(results, errors, dataTransformer) {
    /* returns binary of pdf file with reports data */
    const reportWriter = new ReportWriter("Словарный анализ сайтов");

    const resultsLen = Object.keys(results).length;
    const errorsLen = Object.keys(errors).length;

    if (!(resultsLen || errorsLen)) {
        reportWriter.appendSubHeader("Нету сайтов для анализа");
    }

    if (resultsLen) {
        reportWriter.appendContentEl("\n");
        reportWriter.appendSubHeader("Результаты анализа:");
        reportWriter.appendTable(dataTransformer.resultsToArrayTable(results));
    }

    if (errorsLen) {
        reportWriter.appendContentEl("\n", {repeat: 4});
        reportWriter.appendSubHeader("Ошибки:");
        reportWriter.appendTable(dataTransformer.errsToArrayTable(errors));
    }

    return await reportWriter.getDocBinary();
}

module.exports = generateAnalyseReport;