export const config = {
    server: {
        port: process.env.API_PORT || 3000,
        host: process.env.API_HOST || 'localhost'
    },
    swaggerHost: process.env.SWAGGER_HOST || 'localhost'
}
