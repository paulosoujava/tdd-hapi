const Joi = require("@hapi/joi"),
    DeleteValidationConfig = require('./../../validations/heros/deletevalidation')

class SwaggerListDocumentation {

    static configSwaggerAndValidation() {
        return {
            tags: ['api'],
            description: 'Deletar um intem o mongo db',
            notes: 'Deleta com base no id informado',
            plugins: {
                payloadType: 'form',
                'hapi-swagger': {
                    responses: {
                        500: { description: 'Erro Interno' },
                        400: { description: 'Bad Request' },
                        401: { description: 'Token Expired' },
                        200: {
                            description: 'Success',
                            schema: Joi.object({
                                message: Joi.string().description('Acao realizada com sucesso'),
                                id: Joi.string().description('id'),
                            }).label('DELETE_RETURN')
                        },

                    }
                }
            },
            validate: DeleteValidationConfig.authValidatConfig('delete')
        }

    }

}
module.exports = new SwaggerListDocumentation