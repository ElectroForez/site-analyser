const path = require('path');
const fontsPath = path.resolve('fonts');

const fonts = {
    Roboto: {
        normal: path.join(fontsPath, 'Roboto', 'Roboto-Regular.ttf'),
        bold: path.join(fontsPath, 'Roboto', 'Roboto-Medium.ttf'),
        italics: path.join(fontsPath, 'Roboto', 'Roboto-Italic.ttf'),
        bolditalics: path.join(fontsPath, 'Roboto', 'Roboto-MediumItalic.ttf')
    }
};

module.exports = fonts;
