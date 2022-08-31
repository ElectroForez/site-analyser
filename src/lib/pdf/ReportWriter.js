const PdfPrinter = require('pdfmake');
const fonts = require('./fonts');
const docDefiniton = require('./docDefinition');
const fs = require("fs");

class ReportWriter {
    constructor(reportHeader="") {
        this.printer = new PdfPrinter(fonts);
        this.options = {};
        this.docDefinition = deepClone(docDefiniton);
        this.setDocHeader(reportHeader);
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

    setDocHeader(text, headerPos=0) {
        this.setContentEl({text, style: 'header'}, headerPos);
    }

    setContentEl(contentEl, pos) {
        this.docDefinition.content[pos] = contentEl;
    }

    appendContentEl(contentEl, options={repeat:1}) {
        for (let i=0; i < options.repeat; i++) {
            this.docDefinition.content.push(deepClone(contentEl));
        }
    }

    appendSubHeader(text) {
        this.appendContentEl({text, style: 'subHeader'});
    }

    appendTable(array) {
        this.appendContentEl(this._getPdfTableFromArray(array));
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

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = ReportWriter;
