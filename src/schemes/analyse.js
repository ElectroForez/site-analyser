const Joi = require('joi');
const Boom = require('@hapi/boom');

const requestScheme = {
    payload: Joi.object({
        urls: Joi.array().items(Joi.string()).required()
            .example(["http://yandex.ru", "http://habrahabr.ru"])
            .description('urls for analyse'),
        analyse: Joi.object({
            ignoreRegister: Joi.boolean()
                .default(false)
                .example(true)
                .description("if true, content will be transform to lower case to ignore register"),
            wordsCount: Joi.number().integer().min(1)
                .default(3)
                .example(2)
                .description('how many words need to return in analyse'),
            minWordLen: Joi.number().integer().min(1)
                .default(5)
                .example(4)
                .description('what length of the word is needed to get into analysis'),
        }).label("analyse options"),
        pdf: Joi.object({
            success: Joi.object({
                includeColumns: Joi.array().items(Joi.string())
                    .default(["url", "values", "redirect"])
                    .example(["url", "values"])
                    .label("success columns")
                    .description("these columns will be printed at pdf doc"),
                }).label("success pdf table options"),
            errors: Joi.object({
                includeColumns:  Joi.array().items(Joi.string())
                    .default(["url", "error", "redirect"])
                    .example(["url", "error"])
                    .label("errors columns")
                    .description("these columns will be printed at pdf doc"),
            }).label("errors pdf table options")
        }).label("pdf generating options")
    },
).label('Body siteAnalyse'),
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