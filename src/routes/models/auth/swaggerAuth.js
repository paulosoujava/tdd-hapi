const Joi = require("@hapi/joi")
const AuthValidation = require("./../../validations/auth/authValidation");

class AuthDocumantation {

    static configSwaggerAndValidation() {
        return {
            auth: false,
            tags: ['api'],
            description: 'Fazer login para obter o token de acesso a api',
            notes: "Faz login com user e senha do banco usando o bcrypt",
            plugins: {
                payloadType: 'form',
                'hapi-swagger': {
                    responses: {
                        500: {
                            description: 'Retorna um erro do servidor, algo não saiu como planejado'
                        },
                        400: {
                            description: 'Uma má requisição foi feita, todos os paramentros devem ser enviados username min 3 max 15 e senha min 3 max 8'
                        },
                        200: {
                            description: 'Pode comemorar por que deu tudo certo e um token foi retornado para você utilizar na api',
                            schema: Joi.object({
                                token: Joi.string().description('Aqui vai um token bem grande')
                            }).label('RETURN_TOKEN_LOGIN')
                        }
                    }
                }
            },
            validate: AuthValidation.authValidatConfig()
        }

    }
}
module.exports = AuthDocumantation