const Joi = require('joi');
const Boom = require('@hapi/boom');

const requestScheme = {
    payload: Joi.object({
        ignoreRegister: Joi.boolean().default(false)
            .example(true),
        wordsCount: Joi.number().integer().min(1).default(3)
            .example(3),
        minWordLen: Joi.number().integer().min(1).default(5)
            .example(4),
        urls: Joi.array().items(Joi.string()).required()
            .example(["http://yandex.ru", "http://habrahabr.ru"])
    }),

    failAction: async function (request, h, error) {
        const errorMessage = error.details.map(detail => detail.message + ";\n");
        const strErrorMessage = errorMessage.toString().replaceAll("\"", "'");
        throw Boom.badRequest(strErrorMessage);
    },
    options: {
        abortEarly: false,
    }
}

module.exports = {
    requestScheme
}