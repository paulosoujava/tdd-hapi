const Joi = require("@hapi/joi"),
    Config = require('./../../validations/auth/emailValidation')

class SwaggerListDocumentation {


    static configSwaggerAndValidation() {
        return {
            auth: false,
            tags: ['api'],
            description: 'Esqueceu a senha',
            notes: 'Um link será enviado para o usuário que esqueceu a senha',
            plugins: {
                payloadType: 'form',
                'hapi-swagger': {
                    responses: {
                        500: { description: 'Erro Interno' },
                        400: { description: 'Bad Request' },
                        200: {
                            description: 'teste',
                            schema: Joi.object({
                                message: Joi.string().description('acao realizada com sucesso'),
                                email: Joi.string().description('email@email.com'),
                            }).label('EMAIL_RETURN')
                        },
                        401: { description: 'Token Expired' },

                    }
                }
            },
            validate: Config.emailValidatConfig()
        }

    }
}
module.exports = SwaggerListDocumentation