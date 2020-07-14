const assert = require('assert')
const api = require('./../api')

let app = {}
const MOCK_USER = {
    nome: 'Paulo Colorado',
    poder: 'marreta bionica'
}
let MOCK_ID_TO_UPDATE_AND_DELETE = ""

const TOKEN_MOCK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicGF1bG8iLCJpZCI6IjVmMGRlMmNjNGM2MGNmOGM5OWIyMzJmYSIsImlhdCI6MTU5NDc2ODU1Nn0.TPSYXwrwYlBmVXER2jwRZM-5dn5Ue3yItsUx086SxQg'
const headers = {
    authorization: TOKEN_MOCK
}

describe('Suite de testes da API', function() {
    this.beforeAll(async() => {
        app = await api
    })

    it('Listar todos /herois', async() => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois'
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        const dados = JSON.parse(result.payload)
        assert.ok(Array.isArray(dados))
    })
    it('Não deve listar sem o token /herois', async() => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 401)
    })

    it('deve listar  os 10 registros informados no limit /herois?skip=0&limit', async() => {
        LIMIT_SIZE = 10
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${LIMIT_SIZE}`,
            headers
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        const dados = JSON.parse(result.payload)
        assert.ok(dados.length == LIMIT_SIZE)

    })
    it('Deve dar um erro ao listar LIMIT nao sendo inteiro /herois?skip=0&limit=LIMIT NAO EH INTEIRO', async() => {

        LIMIT_SIZE = 'LIMIT NAO EH INTEIRO'

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${LIMIT_SIZE}`,
            headers
        })

        assert.ok(result.statusCode === 400)
    })
    it('Deve filtrar pelo nome /herois?nome=NOME A SER FILTRADO', async() => {

        NAME_FILTER = 'Chapolin Colorado 0'

        const result = await app.inject({
            method: 'GET',
            url: `/herois?nome=${NAME_FILTER}`,
            headers
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        const dados = JSON.parse(result.payload)
        assert.ok(dados[0].nome === NAME_FILTER)
    })

    it('Deve cadastrar  um heroi  /herois', async() => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: MOCK_USER,
            headers
        })
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)
        const dados = JSON.parse(result.payload)
        assert.deepEqual(dados.message, 'acao concluida com sucesso')
        assert.notStrictEqual(dados._id, undefined)
        MOCK_ID_TO_UPDATE_AND_DELETE = dados._id
    })

    it('Deve atualizar pelo id /herois/ID', async() => {
        const MOCK_USER_UPDATE = {
            ...MOCK_USER,
            poder: 'VIOLAO ASSASINO'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_ID_TO_UPDATE_AND_DELETE}`,
            payload: MOCK_USER_UPDATE,
            headers
        })
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)
        const dados = JSON.parse(result.payload)
        assert.deepEqual(dados.message, 'acao concluida com sucesso')
        assert.ok(dados.modified === 1)
    })

    it('Nao deve atualizar PATCH com id inexistente /herois/ID', async() => {
        const MOCK_USER_UPDATE = {
            ...MOCK_USER,
            poder: 'VIOLAO ASSASINO'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/5f0c9e48f67b641d526e10bc`,
            payload: MOCK_USER_UPDATE,
            headers
        })
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)

    })

    it('Nao deve cadastrar sem os dados Nome e Pode /herois', async() => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: "",
            headers
        })

        const statusCode = result.statusCode
        assert.ok(statusCode === 400)


    })
    it('Deve atualizar PUT pelo id /herois/ID', async() => {
        const MOCK_USER_UPDATE = {
            nome: 'ATUALIZA TUDO',
            poder: 'VIOLAO ASSASINO'
        }
        const result = await app.inject({
            method: 'PUT',
            url: `/herois/${MOCK_ID_TO_UPDATE_AND_DELETE}`,
            payload: MOCK_USER_UPDATE,
            headers
        })
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)
        const dados = JSON.parse(result.payload)
        assert.deepEqual(dados.message, 'acao concluida com sucesso')
        assert.ok(dados.modified === 1)
    })

    it('Deve deletar pelo id', async() => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${MOCK_ID_TO_UPDATE_AND_DELETE}`,
            headers
        })
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)
        payload_response = {
            message: "acao concluida com sucesso",
            modified: 1
        }
        assert.deepEqual(JSON.stringify(payload_response), result.payload)
    })

    it('Nao deve deletar id inexistente', async() => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/5f0c9e48f67b641d526e10bc`,
            headers
        })
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)
        payload_response = {
            message: "acao concluida com sucesso",
            modified: 0
        }
        assert.deepEqual(JSON.stringify(payload_response), result.payload)
    })



})