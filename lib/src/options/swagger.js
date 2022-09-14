const config = require('../../config');
const Package = {
    title: process.env.npm_package_title || "",
    description: process.env.npm_package_description || "",
    version: process.env.npm_package_version || ""
};
export const swagger = {
    info: {
        title: Package.title + " API Documentation",
        description: Package.description,
        version: Package.version
    },
    jsonPath: '/documentation.json',
    documentationPath: '/documentation',
    schemes: ['https', 'http'],
    host: config.swaggerHost,
    debug: true
};
