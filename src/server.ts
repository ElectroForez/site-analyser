'use strict';
import Hapi from "@hapi/hapi";
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import * as HapiSwagger from "hapi-swagger";
import * as glob from "glob";

import {config} from "../config";
import * as options from "./options";

export const createServer = async () => {
    const server = Hapi.server(config.server);

    const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
        {
            plugin: Inert
        },
        {
            plugin: Vision
        },
        {
            plugin: HapiSwagger,
            options: options.swagger
        }
    ];

    await server.register(plugins);

    // const extensionsFiles = filepaths.getSync(path.join(__dirname, 'extensions'), {});
    // for (const extensionFile of extensionsFiles) {
    //     const extension = require(extensionFile);
    //     const events = extension.events;
    //     const method = extension.method;
    //     server.ext(events, method);
    // }

    // const routesFiles = filepaths.getSync(path.join(__dirname, 'routes'), {});
    const routesFiles = glob.sync('./routes/*.ts', {cwd: __dirname});
    for (const routeFile of routesFiles) {
        const { route } = await import(routeFile);
        server.route(route);
    }

    await server.start();
    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('Happened unhandledRejection');
    process.exit(1);
});
