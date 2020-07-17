const Joi = require("@hapi/joi")

class ListValidation {
    static authValidatConfig() {
        return {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).unknown(),
            failAction: (request, headers, error) => {
                return error
            },
            query: Joi.object({
                skip: Joi.number().description('1'),
                limit: Joi.number().description('10'),
                nome: Joi.string().description('Chapolin')
            })
        }
    }
}

module.exports = ListValidation