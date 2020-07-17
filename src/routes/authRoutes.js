const BaseRoute = require('./base/baseRoute'),
    Boom = require("boom"),
    Jwt = require('jsonwebtoken'),
    PasswordHelper = require('./../helpers/passwordHelper'),
    SwaggerAuthDocumentation = require('./models/auth/swaggerAuth'),
    SwaggerAuthEmaillDocumentation = require('./models/auth/swaggerAuthEmail'),
    SwaggerAuthRecoveyDocumentation = require('./models/auth/swaggerAuthToken')


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
            config: SwaggerAuthDocumentation.configSwaggerAndValidation,

        }
    }
    forget() {
        return {
            path: '/login/forget',
            method: 'POST',
            handler: async(request) => {
                const { email } = request.payload
                const [user] = await this._db.read({
                    username: email
                })
                if (!user)
                    return Boom.preconditionFailed('Verifique o usuário e tente novamente')


                return {
                    message: 'acao realizada com sucesso',
                    email: email,
                    id: user._id
                }

            },
            config: SwaggerAuthEmaillDocumentation.configSwaggerAndValidation
        }
    }

    update() {
        return {
            path: '/login/recovery',
            method: 'POST',
            handler: async(request) => {
                const { id, password } = request.payload
                const [user] = await this._db.read({ _id: id })

                if (!user)
                    return Boom.preconditionFailed('Verifique o usuário e tente novamente')


                const newPass = await PasswordHelper.hashPassword(password)
                const pass = { password: newPass }
                const dadosString = JSON.stringify(pass)
                const dados = JSON.parse(dadosString)
                const result = await this._db.update(id, dados)
                    /* istanbul ignore next */
                return {
                    message: 'acao realizada com sucesso',
                    modified: result.nModified,
                    token: Jwt.sign({
                        user: user.username,
                        id: user._id
                    }, this._secret, { expiresIn: process.env.TIME_TO_EXPIRED })
                }

            },
            config: SwaggerAuthRecoveyDocumentation.configSwaggerAndValidation
        }
    }
}

module.exports = AuthRoutes