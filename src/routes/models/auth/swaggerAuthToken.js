const Joi = require("@hapi/joi"),
    Config = require('./../../validations/auth/passwordValidation')

class SwaggerListDocumentation {


    static configSwaggerAndValidation() {
        return {
            auth: false,
            tags: ['api'],
            description: 'Nova senha',
            notes: 'Uma nova senha sera cadastrada e ira gerar um token',
            plugins: {
                payloadType: 'form',
                'hapi-swagger': {
                    responses: {
                        500: { description: 'Erro Interno' },
                        400: { description: 'Bad Request' },
                        200: {
                            description: 'Retorna o sucesso a glória, com uma mensagem, quantos itens modificados e um novo token',
                            schema: Joi.object({
                                message: Joi.string().description('acao realizada com sucesso'),
                                modified: Joi.string().description('1 ou 0'),
                                token: Joi.string().description('token de acesso')
                            }).label('EMAIL_RETURN_WITH_TOKEN')
                        },
                        412: { description: 'Precondition Failed' },

                    }
                }
            },
            validate: Config.recoveryValidatConfig()
        }

    }
}
module.exports = SwaggerListDocumentation