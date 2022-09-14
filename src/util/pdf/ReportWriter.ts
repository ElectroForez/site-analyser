import PdfPrinter from 'pdfmake';
import * as fonts from "./fonts";
import {docDefiniton} from "./docDefinition";
import * as fs from "fs";
import {ContentStack, TDocumentDefinitions} from "pdfmake/interfaces";

export default class ReportWriter {
    private printer: PdfPrinter;
    private docDefinition: TDocumentDefinitions;

    constructor(reportHeader="") {
        this.printer = new PdfPrinter(fonts);
        this.docDefinition = deepClone(docDefiniton);
        this.setDocHeader(reportHeader);
    }

    _getPdfTableFromArray(array: Array<Array<any>>) {
        return {
            layout: 'lightHorizontalLines',
            table: {
                headersRow: 1,
                width: ['*', 'auto', 100, '*'],
                body: array
            }
        }
    }

    setDocHeader(text: string, headerPos:number=0) {
        this.setContentEl({text, style: 'header'}, headerPos);
    }

    setContentEl(contentEl: any, pos: number) {
        // @ts-ignore
        this.docDefinition.content[pos] = contentEl;
    }

    appendContentEl(contentEl:any, options={repeat:1}) {
        for (let i=0; i < options.repeat; i++) {
            // @ts-ignore
            this.docDefinition.content.push(deepClone(contentEl));
        }
    }

    appendSubHeader(text: string) {
        this.appendContentEl({text, style: 'subHeader'});
    }

    appendTable(array: Array<Array<any>>) {
        this.appendContentEl(this._getPdfTableFromArray(array));
    }

    saveToFile(savePath: fs.PathLike) {
        const pdfDoc = this.pdfDoc;
        pdfDoc.pipe(fs.createWriteStream(savePath));
        pdfDoc.end();
    }

    get pdfDoc() {
        return this.printer.createPdfKitDocument(this.docDefinition);
    }

    async getDocBinary(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const pdfDoc = this.pdfDoc;
            const chunks: Array<Uint8Array> = [];

            pdfDoc.on('data', function (chunk) {
                chunks.push(chunk);
            });

            pdfDoc.on('end', function () {
                const result = Buffer.concat(chunks);
                resolve(result);
            });
            pdfDoc.end();
        })
    }
}

function deepClone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
