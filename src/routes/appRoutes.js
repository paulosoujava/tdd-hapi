const BaseRoute = require('./base/baseRoute'),
    Joi = require("joi"),
    Boom = require("boom")


const failAction = (r, h, e) => { throw e }

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class AppRoutes extends BaseRoute {
    constructor(db) {
        super()
        this._db = db
    }

    _message() {
        return 'acao concluida com sucesso'
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    failAction,
                    headers,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100),
                    })
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query

                    let query = {
                        nome: {
                            $regex: `.*${nome}*.`
                        }
                    }

                    return this._db.read(nome ? query : {}, skip, limit)
                } catch (error) {
                    /* istanbul ignore next */
                    return Boom.internal()
                }

            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    headers,
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100).required(),
                        poder: Joi.string().min(3).max(100).required(),
                    })
                }
            },
            handler: async(request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this._db.create({ nome, poder })
                    return { message: this._message(), _id: result._id }

                } catch (err) {
                    /* istanbul ignore next */
                    return Boom.internal()
                }
            }
        }

    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
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
                },
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
                }
            }
        }
    }

    updateAll() {
        return {
            path: '/herois/{id}',
            method: 'PUT',
            config: {
                tags: ['api'],
                description: 'Cadastra um heroi, com nome e poder',
                notes: 'Com o method POST você DEVE enviar um nome e um poder',
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            500: { 'description': 'Internal error' },
                            400: { 'description': 'BadRequest' },
                            200: { 'description': 'Ok' }
                        }
                    }
                },
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
                },
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
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async(request) => {
                try {
                    const { id } = request.params
                    const result = await this._db.delete(id)
                    return { message: this._message(), modified: result.n }
                } catch (error) {
                    /* istanbul ignore next */
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = AppRoutes