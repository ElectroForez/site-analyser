'use strict';

const Hapi = require('@hapi/hapi');
const filepaths = require('filepaths');

const createServer = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    const extensionsFiles = filepaths.getSync(__dirname + '/extensions/', {});
    for (const extensionFile of extensionsFiles) {
        const extension = require(extensionFile);
        const events = extension.events;
        const method = extension.method;
        server.ext(events, method);
    }

    const routesFiles = filepaths.getSync(__dirname + '/routes/', {});
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

createServer()
    .then(server => console.log(`Server running on ${server.info.uri}`));
