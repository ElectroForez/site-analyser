import * as path from "path";
import {TFontFamilyTypes} from "pdfmake/interfaces";
const fontsPath = path.resolve('fonts');

export const Roboto: TFontFamilyTypes = {
    normal: path.join(fontsPath, 'Roboto', 'Roboto-Regular.ttf'),
    bold: path.join(fontsPath, 'Roboto', 'Roboto-Medium.ttf'),
    italics: path.join(fontsPath, 'Roboto', 'Roboto-Italic.ttf'),
    bolditalics: path.join(fontsPath, 'Roboto', 'Roboto-MediumItalic.ttf')
}
