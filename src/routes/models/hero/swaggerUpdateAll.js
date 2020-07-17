const Joi = require("@hapi/joi"),
    Config = require('./../../validations/heros/updateValidationAll')

class SwaggerUpdateAllDocumentation {

    static configSwaggerAndValidation() {
        return {
            tags: ['api'],
            description: 'Atualiza todos os campos, nome e poder',
            notes: 'Você deve mandar os dois campos nome e poder pois são obrigatório para mandar um só use o patch',
            plugins: {
                payloadType: 'form',
                'hapi-swagger': {

                    responses: {
                        500: { description: 'Erro Interno' },
                        400: { description: 'Bad Request' },
                        401: { description: 'Token Expired' },
                        200: {
                            description: 'Obrigatório a atualização de todos',
                            schema: Joi.object({
                                message: Joi.string().required().min(3).max(100).description('Acao realizada com sucesso'),
                                modified: Joi.string().required().min(3).max(100).description('1 ou 0'),
                            }).label('USER_RETURN_UPDATE_ALL')
                        },
                    }
                }
            },
            validate: Config.authValidatConfig()
        }

    }
}
module.exports = SwaggerUpdateAllDocumentation