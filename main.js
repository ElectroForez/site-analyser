const createServer = require('./src/server');

createServer()
    .then(server => console.log(`Server running on ${server.info.uri}`));