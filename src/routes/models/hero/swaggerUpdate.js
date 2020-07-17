const Joi = require("@hapi/joi"),
    Config = require('./../../validations/heros/updateValidation')

class SwaggerUpdateDocumentation {

    static configSwaggerAndValidation() {
        return {
            tags: ['api'],
            description: 'Atualização de um ou mais campo',
            notes: 'Edita um ou todos os campos do mongo',
            plugins: {
                payloadType: 'form',
                'hapi-swagger': {
                    responses: {
                        500: { description: 'Erro Interno' },
                        400: { description: 'Bad Request' },
                        401: { description: 'Token Expired' },
                        200: {
                            description: 'Você pode mandar só um para atualizar',
                            schema: Joi.object({
                                message: Joi.string().min(3).max(100).description('Acao realizada com sucesso'),
                                modified: Joi.string().min(3).max(100).description('1 ou 0'),
                            }).label('USER_RETURN_UPDATE_ONE')
                        },
                    }
                }
            },
            validate: Config.authValidatConfig()
        }

    }
}
module.exports = SwaggerUpdateDocumentation