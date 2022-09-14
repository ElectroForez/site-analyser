import {TDocumentDefinitions} from "pdfmake/interfaces";

export const docDefiniton: TDocumentDefinitions = {
    content: [
        {text: 'Заголовок', style: 'header'},
        '\n',
        '\n',
        '\n',
        '\n',
        '\n',
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        },
        tableHeader: {
            bold: false,
            fontSize: 13,
            color: 'black'
        },
        subHeader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
        }
    }
};
