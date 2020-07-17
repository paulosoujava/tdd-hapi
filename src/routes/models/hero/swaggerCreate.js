const Joi = require("@hapi/joi"),
    Config = require('./../../validations/heros/createValidation')

class SwaggerListDocumentation {


    static configSwaggerAndValidation() {
        return {
            tags: ['api'],
            description: 'Criação de Users',
            notes: 'Cria usuários e cadastra no mongo db',
            plugins: {
                payloadType: 'form',
                'hapi-swagger': {
                    responses: {
                        500: { description: 'Erro Interno' },
                        400: { description: 'Bad Request' },
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                message: Joi.string().description('Acao realizada com sucesso'),
                                id: Joi.string().description('id'),
                            }).label('USER_RETURN_CREATE')
                        },
                        401: { description: 'Token Expired' },

                    }
                }
            },
            validate: Config.authValidatConfig()
        }

    }
}
module.exports = SwaggerListDocumentation