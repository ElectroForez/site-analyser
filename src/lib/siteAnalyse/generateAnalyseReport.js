const { ReportWriter } = require("../pdf");
const dataTransform = require("./dataTransform");

async function generateAnalyseReport(results) {
    /* returns binary of pdf file with reports data */
    const reportWriter = new ReportWriter("Словарный анализ сайтов");

    const successLen = Object.keys(results.success).length;
    const errorsLen = Object.keys(results.errors).length;

    if (!(successLen || errorsLen)) {
        reportWriter.appendSubHeader("Нету сайтов для анализа");
    }

    if (successLen) {
        reportWriter.appendContentEl("\n");
        reportWriter.appendSubHeader("Результаты анализа:");
        reportWriter.appendTable(dataTransform.successToMatrix(results.success));
    }

    if (errorsLen) {
        reportWriter.appendContentEl("\n", {repeat: 4});
        reportWriter.appendSubHeader("Ошибки:");
        reportWriter.appendTable(dataTransform.errsToMatrix(results.errors));
    }

    return await reportWriter.getDocBinary();
}

module.exports = generateAnalyseReport;