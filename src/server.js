'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

const filepaths = require('filepaths');
const config = require('../config');
const path = require("path");
const swaggerOptions = require('./swaggerOptions');

const createServer = async () => {
    const server = Hapi.server(config.server);
    await server.register([
        Inert,
        Vision,
        {
            plugin: require('hapi-swagger'),
            options: swaggerOptions
        }
    ])

    const extensionsFiles = filepaths.getSync(path.join(__dirname, 'extensions'), {});
    for (const extensionFile of extensionsFiles) {
        const extension = require(extensionFile);
        const events = extension.events;
        const method = extension.method;
        server.ext(events, method);
    }

    const routesFiles = filepaths.getSync(path.join(__dirname, 'routes'), {});
    for (const routeFile of routesFiles) {
        server.route(require(routeFile));
    }

    await server.start();
    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('Happened unhandledRejection');
    process.exit(1);
});

module.exports = createServer;
