const BaseRoute = require('./base/baseRoute'),
    Joi = require("@hapi/joi"),
    Boom = require("boom"),
    Jwt = require('jsonwebtoken'),
    PasswordHelper = require('./../helpers/passwordHelper'),
    Models = require('./models/models_responses')


const failAction = (r, h, e) => { throw e }


class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this._secret = secret
        this._db = db
        this._AUTH = 'AUTH'
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
                    }, this._secret, { expiresIn: process.env.TIME_TO_EXPIRED })
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
                                description: Models.description(500, this._AUTH),
                                schema: Models.schema(500, this._AUTH)
                            },
                            400: {
                                description: Models.description(400, this._AUTH),
                                schema: Models.schema(400, this._AUTH)
                            },
                            200: {
                                description: Models.description(200, this._AUTH),
                                schema: Models.schema(200, this._AUTH)
                            },

                        }
                    }
                },
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required().description('login@login.com'),
                        password: Joi.string().required().description('sua_senha_poderosa')
                    }).label('ModelAuth')
                }
            }
        }
    }
}

module.exports = AuthRoutes