import {Results, TransformData} from "./interfaces";
import * as transformData from "./transformData";
import ReportWriter from "../pdf/ReportWriter";

export interface GenerateOptions {
    success: TransformData.resultsToMatrixOptions;
    errors: TransformData.resultsToMatrixOptions;
}

export default async function generateAnalyseReport(results: Results, options: GenerateOptions) {
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
        reportWriter.appendTable(transformData.successToMatrix(results.success, options.success));
    }

    if (errorsLen) {
        reportWriter.appendContentEl("\n", {repeat: 4});
        reportWriter.appendSubHeader("Ошибки:");
        reportWriter.appendTable(transformData.errsToMatrix(results.errors, options.errors));
    }

    return await reportWriter.getDocBinary();
}
