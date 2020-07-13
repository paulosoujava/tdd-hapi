const BaseRoute = require('./base/baseRoute')
const Joi = require("joi")


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
                    return 'error'
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
                    console.log(err);
                    return
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
                        return { message: this._message(), modified: result.nModified }

                    } catch (err) {
                        console.log(err);
                        return
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
                        return { message: this._message(), modified: result.nModified }

                    } catch (err) {
                        console.log(err);
                        return
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
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                }
            },
            handler: async(request) => {
                try {
                    const { id } = request.params
                    const result = await this._db.delete(id)
                    return { message: this._message(), modified: result.n }
                } catch (error) {
                    console.log(err);
                    return
                }
            }
        }
    }
}

module.exports = AppRoutes