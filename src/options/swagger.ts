import {RegisterOptions} from "hapi-swagger";

import {config} from "../../config";

const Package = require('../../package.json');

export const swagger: RegisterOptions = {
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
