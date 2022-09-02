const config = require('../config');
const Package = require('../package');

module.exports = {
    info: {
        title: Package.name + " API Documentation",
        description: Package.description,
        version: Package.version
    },
    jsonPath: '/documentation.json',
    documentationPath: '/documentation',
    schemes: ['https', 'http'],
    host: config.swaggerHost,
    debug: true
}
