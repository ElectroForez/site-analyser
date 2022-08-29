const PdfPrinter = require('pdfmake');
const fonts = require('./fonts');
const docDefiniton = require('./docDefinition');
const fs = require("fs");

module.exports = class PdfWriter {
    constructor() {
        this.printer = new PdfPrinter(fonts);
        this.options = {};
        this.docDefinition = JSON.parse(JSON.stringify(docDefiniton));
    }

    _getPdfTableFromArray(array) {
        return {
            layout: 'lightHorizontalLines',
            table: {
                headersRow: 1,
                width: ['*', 'auto', 100, '*'],
                body: array
            }
        }
    }

    insertContentEl(contentEl, options={}) {
        const repeat = options.repeat || 1;

        for (let i=0; i < repeat; i++) {
            this.docDefinition.content.push(contentEl);
        }
    }

    insertSubHeader(text) {
        this.docDefinition.content.push({text, style: 'subHeader'});
    }

    insertTable(array) {
        this.insertContentEl(this._getPdfTableFromArray(array));
    }

    saveToFile(savePath) {
        const pdfDoc = this.pdfDoc;
        pdfDoc.pipe(fs.createWriteStream(savePath));
        pdfDoc.end();
    }

    get pdfDoc() {
        return this.printer.createPdfKitDocument(this.docDefinition, this.options);
    }

    async getDocBinary() {
        return new Promise((resolve, reject) => {
            const pdfDoc = this.pdfDoc;
            const chunks = [];

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