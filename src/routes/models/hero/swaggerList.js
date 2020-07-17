const Joi = require("@hapi/joi"),
    ListValidationConfig = require('./../../validations/heros/listValidation')

class SwaggerListDocumentation {

    static configSwaggerAndValidation() {
        return {
            tags: ['api'],
            description: 'Retorna todos os herois do mongo db',
            notes: 'Pode-se filtrar pelo nome, fazer um skip com limite',
            plugins: {
                payloadType: 'form',
                'hapi-swagger': {
                    responses: {
                        500: {
                            description: 'Ops aqui a falha é nossa'
                        },
                        400: {
                            description: 'Se deu este erro você possívelmente não enviou o que pedminos'
                        },
                        401: {
                            description: 'Aqui o seu token expirou e você deve fazer o login novamente'
                        },
                        200: {
                            description: 'Retorna todos os usuários no formato abaixo',
                            schema: Joi.object({
                                nome: Joi.string().description('Chapolis'),
                                poder: Joi.string().description('Marreta Bionica'),
                            }).label('USER_RETURN_LIST')
                        }

                    }
                }
            },
            validate: ListValidationConfig.authValidatConfig()
        }

    }
}
module.exports = SwaggerListDocumentation