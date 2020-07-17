const assert = require('assert'),
    api = require('./../api'),
    Context = require('./../src/db/base/context'),
    MongoDB = require('./../src/db/mongo/mongo'),
    AuthSchema = require('./../src/db/mongo/schemas/authSchema')


let app = {}
let authDb = {}

describe('Suite de testes Auth', function() {
    this.beforeAll(async() => {
        app = await api

        const connection = MongoDB.connect()
        authDb = new Context(new MongoDB(connection, AuthSchema))

        // await authDb.create({
        //     username: 'paulo',
        //     password: '$2b$04$mq3/zevQkwhDovivvZRvqOQ6srVtTdIAmwCQFQOOrzxknGXAp.9ny'
        // })

    })
    it('Verificar a Conexao', async() => {
        const result = await authDb.isConnected()
        assert.deepEqual(result, 'Conectado')
    })

    it('Deve obter um token validando o usuario no mongo', async() => {
        const res = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'paulo',
                password: 'Paulo@123'

            }
        })

        //console.log(res);
        //*********************************************
        //PAYLOAD COM O FailAction
        //********************************************* 
        /*
            payload: '{
              "statusCode":400,
              "error":"Bad Request",
              "message":"child \\"password\\" fails because [\\"password\\" is required]",
              "validation":{"source":"payload","keys":["password"]}}',
        */
        //*********************************************
        //PAYLOAD SEM O FailAction
        //********************************************* 
        /*
          payload: '{
            "statusCode":400,
            "error":"Bad Request",
            "message":"Invalid request payload input"}',
        */

        //console.log(res.statusCode); //400
        //console.log(res.statusMessage); //BAd Request
        //RESULT
        //console.log(res.result.error); //Bad Request
        //console.log(res.result.statusCode); //400
        //console.log(res.result.message); //Invalid request payload input

        const statusCode = res.statusCode
        const dados = JSON.parse(res.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)

    })
    it('Deve retornar uma mensagem de usuário inexistente status code 401', async() => {
        const res = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'paulos',
                password: '12q34'

            }
        })
        const statusCode = res.statusCode
        assert.deepEqual(res.result.message, 'usuario inexistente')
        assert.deepEqual(statusCode, 401)

    })
    it('Deve retornar uma mensagem de usuario/senha invalidos status code 401', async() => {
        const res = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'paulo',
                password: '12q34'

            }
        })
        const statusCode = res.statusCode
        assert.deepEqual(res.result.message, 'usuario/senha invalido')
        assert.deepEqual(statusCode, 401)

    })
    it('Deve retornar uma mensagem de acao realizada com sucesso code 200', async() => {
        const res = await app.inject({
                method: 'POST',
                url: '/login/forget',
                payload: {
                    email: 'paulo'

                }
            })
            //console.log(res);
        const statusCode = res.statusCode
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(res.result.message, 'acao realizada com sucesso')
    })
    it('Deve retornar um Precondition Failed e code 412" ', async() => {
        const res = await app.inject({
                method: 'POST',
                url: '/login/forget',
                payload: {
                    email: 'paulos'

                }
            })
            //console.log(res);
        const statusCode = res.statusCode
        assert.deepEqual(statusCode, 412)
        assert.deepEqual(res.result.error, 'Precondition Failed')
        assert.deepEqual(res.result.message, 'Verifique o usuário e tente novamente')
    })
    it.only('Deve mudar a senha e gerar um novo token " ', async() => {
        const res = await app.inject({
            method: 'POST',
            url: '/login/recovery',
            payload: {
                id: '5f0de2cc4c60cf8c99b232fa',
                password: '123'

            }
        })

        const statusCode = res.statusCode
        assert.ok(res.result.modified === 1)
        assert.ok(res.result.token.length > 10)
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(res.result.message, 'acao realizada com sucesso')
    })
})