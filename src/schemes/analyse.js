const Joi = require('joi');
const Boom = require('@hapi/boom');
const {badRequest} = require("@hapi/boom");

const requestScheme = {
    payload: Joi.object({
        ignoreRegister: Joi.boolean().default(false)
            .example(true)
            .description("if true, content will be transform to lower case to ignore register"),
        wordsCount: Joi.number().integer().min(1).default(3)
            .example(3)
            .description('how many words need to return in analyse'),
        minWordLen: Joi.number().integer().min(1).default(5)
            .example(4)
            .description('what length of the word is needed to get into analysis'),
        urls: Joi.array().items(Joi.string()).required()
            .example(["http://yandex.ru", "http://habrahabr.ru"])
            .description('urls for analyse')
    },
).label('Body urlAnalyse'),
    failAction: async function (request, h, error) {
        const errorMessage = error.details.map(detail => detail.message + ";\n");
        const strErrorMessage = errorMessage.toString().replaceAll("\"", "'");
        throw Boom.badRequest(strErrorMessage);
    },
    options: {
        abortEarly: false,
    }
}

const responseSchemes = {
    200: {
        description: 'success'
    },
    400: {
        description: 'Errors in body',
        schema: Joi.object({
            statusCode: Joi.number().integer().example(400),
            error: Joi.string().example("badRequest"),
            message: "'wordsCounts' is not allowed;\n"
        }).label('Error response')
    }
}

module.exports = {
    requestScheme,
    responseSchemes
}