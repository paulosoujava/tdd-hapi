const BaseRoute = require('./base/baseRoute'),
    Joi = require("@hapi/joi"),
    Boom = require("boom"),
    Models = require('./models/models_responses')


const failAction = (r, h, e) => { throw e }

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()




class AppRoutes extends BaseRoute {
    constructor(db) {
        super()
        this._db = db
        this._HERO = 'HERO'
    }

    _message() {
        return 'acao concluida com sucesso'
    }
    _errors(number) {
        return [{
            description: Models.description(number, this._HERO),
            schema: Models.schema(number, this._HERO)
        }]
    }



    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request) => {
                try {
                    const { skip, limit, nome } = request.query
                    let query = { nome: { $regex: `.*${nome}*.` } }
                    return this._db.read(nome ? query : {}, skip, limit)
                } catch (error) {
                    return Boom.internal()
                }
            },
            config: Models.config(this._HERO, 'list')
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            handler: async(request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this._db.create({ nome, poder })
                    return { message: this._message(), _id: result._id }

                } catch (err) {
                    /* istanbul ignore next */
                    return Boom.internal()
                }
            },
            config: Models.config(this._HERO, 'create')
        }

    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            handler: async(request) => {
                try {
                    const { payload } = request
                    const { id } = request.params
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this._db.update(id, dados)
                        /* istanbul ignore next */
                    return { message: this._message(), modified: result.nModified }

                } catch (err) {
                    /* istanbul ignore next */
                    return Boom.internal()
                }
            },
            config: {
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100),
                    })
                }
            }
        }
    }

    updateAll() {
        return {
            path: '/herois/{id}',
            method: 'PUT',
            handler: async(request) => {
                try {
                    const { payload } = request
                    const { id } = request.params
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this._db.update(id, dados)
                        /* istanbul ignore next */
                    return { message: this._message(), modified: result.nModified }

                } catch (err) {
                    /* istanbul ignore next */
                    return Boom.internal()
                }
            },
            config: {
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100).required(),
                        poder: Joi.string().min(3).max(100).required(),
                    })
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            handler: async(request) => {
                try {
                    const { id } = request.params
                    const result = await this._db.delete(id)
                    return { message: this._message(), modified: result.n }
                } catch (error) {
                    /* istanbul ignore next */
                    return Boom.internal()
                }
            },
            config: {
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            }
        }
    }
}

module.exports = AppRoutes