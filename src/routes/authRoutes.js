const BaseRoute = require('./base/baseRoute'),
    Joi = require("@hapi/joi"),
    Boom = require("boom"),
    Jwt = require('jsonwebtoken'),
    PasswordHelper = require('./../helpers/passwordHelper')

const failAction = (r, h, e) => { throw e }


const responseModel = Joi.object({
    username: Joi.string().required().description('login@login.com'),
    password: Joi.string().required().description('sua_senha_poderosa')
}).label('Model_Auth');

const tokenModel = Joi.object({
    token: Joi.string().description('um_token_bem_grande_vira_se_tudo_certo')
}).label('Model_Token');

const Model500 = Joi.object({
    message: Joi.string().description('Erro Interno')
}).label('Model500');

const Model400 = Joi.object({
    message: Joi.string().description('Bad Request')
}).label('Model400');

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this._secret = secret
        this._db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            handler: async(request) => {
                const { username, password } = request.payload
                const [user] = await this._db.read({
                    username: username.toLowerCase()
                })
                if (!user)
                    return Boom.unauthorized('usuario inexistente')

                const match = await PasswordHelper.comparePassword(password, user.password)
                if (!match)
                    return Boom.unauthorized('usuario/senha invalido')

                return {
                    token: Jwt.sign({
                        user: user.username,
                        id: user._id
                    }, this._secret)
                }
            },
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter login JWT',
                notes: "Faz login com user e senha do banco usando o bcrypt",
                plugins: {
                    payloadType: 'form',
                    'hapi-swagger': {
                        responses: {
                            500: {
                                description: 'Retorna um erro do servidor, algo não saiu como planejado',
                                schema: Model500
                            },
                            400: {
                                description: 'Uma má requisição foi feita, todos os paramentros devem ser enviados username min 3 max 15 e senha min 3 max 8',
                                schema: Model400
                            },
                            200: {
                                description: 'Pode comemorar por que deu tudo certo e um token foi retornado para você utilizar na api',
                                schema: tokenModel
                            },

                        }
                    }
                },
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required().description('login@login.com'),
                        password: Joi.string().required().description('sua_senha_poderosa')
                    }).label('Model_Auth')
                }
            }
        }
    }
}

module.exports = AuthRoutes