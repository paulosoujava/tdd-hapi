const BaseRoute = require('./base/baseRoute'),
    Joi = require("@hapi/joi"),
    Boom = require("boom")


const failAction = (r, h, e) => { throw e }

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

const ModelUser = Joi.object({
    id: Joi.string().description('abcd123efg456'),
    nome: Joi.string().description("Chapolin Colorado"),
    poder: Joi.string().description("marreta bionica"),
}).label('Model_User');

const Model500 = Joi.object({
    message: Joi.string().description('Erro Interno')
}).label('Model500');

const Model400 = Joi.object({
    message: Joi.string().description('Bad Request')
}).label('Model400');


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
            handler: (request) => {
                try {
                    const { skip, limit, nome } = request.query
                    let query = { nome: { $regex: `.*${nome}*.` } }
                    return this._db.read(nome ? query : {}, skip, limit)
                } catch (error) {
                    return Boom.internal()
                }
            },
            config: {
                validate: {
                    failAction,
                    headers,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100),
                    })
                },
                tags: ['api'],
                description: 'GET USERS',
                notes: 'Rotorna todos os usuário do BD necessita de um token para obter livre acesso',
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
                                schema: ModelUser
                            },

                        }
                    }
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastra um heroi, com nome e poder',
                notes: 'Com o method POST você DEVE enviar um nome e um poder',
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
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