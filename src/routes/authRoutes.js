const BaseRoute = require('./base/baseRoute'),
    Joi = require("joi"),
    Boom = require("boom"),
    Jwt = require('jsonwebtoken'),
    passwordHelper = require('./../helpers/passwordHelper')
const PasswordHelper = require('./../helpers/passwordHelper')

const failAction = (r, h, e) => { throw e }

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
            config: {
                auth: false,
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                },
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
                            username,
                            id: user._id
                        }, this._secret)
                    }
                }
            }
        }
    }
}

module.exports = AuthRoutes