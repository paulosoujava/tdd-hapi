Joi = require("@hapi/joi")

const failAction = (r, h, e) => { throw e }

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

//CLASSE RESPONSAVEL PELA DOCUMENTACAO DO SWAGGER E PELO VALIDACAO
//O IDEAL Ë TIRAR A VALIDACAO DAQUI< E DEIXAR SOMENTE A DOCUMENTACAO
class HerosResponse {
    static heroReturns(witch) {
        switch (witch) {
            case 500:
                return Joi.object({
                    message: Joi.string().description('Erro Interno')
                }).label('Model500');
            case 400:
                return Joi.object({
                    message: Joi.string().description('Bad Request')
                }).label('Model400')
            case 401:
                return Joi.object({
                    statusCode: Joi.string().description('401'),
                    error: Joi.string().description('Unauthorized'),
                    message: Joi.string().description('Expired token'),
                    attributes: Joi.object({
                        error: Joi.string().description('Expired token')
                    })
                }).label('Model401');
            case 200:
                return Joi.object({
                    id: Joi.string().description('abcd123efg456'),
                    nome: Joi.string().description("Chapolin Colorado"),
                    poder: Joi.string().description("marreta bionica"),
                }).label('ModelUser');
        }
    }
    static heroDesctiptions(witch) {
        switch (witch) {
            case 500:
                return 'Retorna um erro do servidor, algo não saiu como planejado'
            case 400:
                return 'Uma má requisição foi feita, todos os paramentros devem ser enviados username min 3 max 15 e senha min 3 max 8'
            case 200:
                return 'Pode comemorar por que deu tudo certo e um token foi retornado para você utilizar na api'
            case 401:
                return 'Pode comemorar por que deu tudo certo e um token foi retornado para você utilizar na api'

        }
    }
    static heroApiTags(witch) {
        switch (witch) {
            case 'create_description':
                return 'Cadastra um heroi, com nome e poder'
            case 'create_notes':
                return 'Com o method POST você DEVE enviar um nome e um poder'
            case 'list_description':
                return 'GET USERS'
            case 'list_notes':
                return 'Rotorna todos os usuário do BD necessita de um token para obter livre acesso'

        }
    }
    static errors(number) {
        return {
            description: this.heroDesctiptions(number),
            schema: this.heroReturns(number)
        }
    }
    static configSwaggerAndValidation(which) {
        switch (which) {
            case 'list':
                return {
                    tags: ['api'],
                    description: this.heroApiTags('create_description'),
                    notes: this.heroApiTags('create_notes'),
                    plugins: {
                        payloadType: 'form',
                        'hapi-swagger': {
                            responses: {
                                500: this.errors(500),
                                400: this.errors(400),
                                200: this.errors(200),
                                401: this.errors(401),
                            }
                        }
                    },
                    validate: {
                        failAction,
                        headers,
                        query: Joi.object({
                            skip: Joi.number().integer().default(0),
                            limit: Joi.number().integer().default(10),
                            nome: Joi.string().min(3).max(100),
                        })
                    },
                }
            case 'create':
                return {
                    tags: ['api'],
                    description: this.heroApiTags('create_description'),
                    notes: this.heroApiTags('create_notes'),
                    plugins: {
                        payloadType: 'form',
                        'hapi-swagger': {
                            responses: {
                                500: this.errors(500),
                                400: this.errors(400),
                                200: this.errors(200),
                                401: this.errors(401),
                            }
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
                }
        }
    }


}
module.exports = HerosResponse