const PdfPrinter = require('pdfmake');
const fonts = require('./fonts');
const docDefiniton = require('./docDefinition');
const fs = require("fs");

module.exports = class PdfWriter {
    constructor() {
        this.printer = new PdfPrinter(fonts);
        this.options = {};
        this.docDefinition = JSON.parse(JSON.stringify(docDefiniton));
        // this.pdfDoc = printer.createPdfKitDocument(docDefiniton, options);
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

    insertTable(array) {
        this.insertContentEl(this._getPdfTableFromArray(array));
    }

    insertContentEl(contentEl) {
        this.docDefinition.content.push(contentEl);
    }

    saveToPdf(savePath) {
        const pdfDoc = this.printer.createPdfKitDocument(this.docDefinition, this.options);
        pdfDoc.pipe(fs.createWriteStream(savePath));
        pdfDoc.end();
    }

}