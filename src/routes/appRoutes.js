const BaseRoute = require('./base/baseRoute'),
    Boom = require("boom"),
    SwaggerDocumentation = require('./models/hero/swaggerDocumentation'),
    configList = require('./models/hero/swaggerList'),
    configCreate = require('./models/hero/swaggerCreate'),
    configUpdate = require('./models/hero/swaggerUpdate'),
    configUpdateAll = require('./models/hero/swaggerUpdateAll'),
    configDelete = require('./models/hero/swaggerDelete')


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
            config: configList.configSwaggerAndValidation
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
            config: configCreate.configSwaggerAndValidation
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
            config: configUpdate.configSwaggerAndValidation

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
            config: configUpdateAll.configSwaggerAndValidation
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
            config: configDelete.configSwaggerAndValidation


        }
    }
}

module.exports = AppRoutes