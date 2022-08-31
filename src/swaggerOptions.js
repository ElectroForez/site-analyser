const config = require('../config');
const Package = require('../package');

const swaggerOptions = {
    info: {
        title: Package.name + "API Documentation",
        description: Package.description
    },
    jsonPath: '/documentation.json',
    documentationPath: '/documentation',
    schemes: ['https', 'http'],
    host: config.swaggerHost,
    debug: true
}