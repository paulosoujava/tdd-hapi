const assert = require('assert')
const MongoDB = require('./../../src/db/mongo/mongo')
const Context = require('./../../src/db/base/context')
const HeroSchema = require('./../../src/db/mongo/schemas/heroSchema')

let context = {}
const MOCK_USER = {
    nome: 'Chapolin Colorado',
    poder: 'marreta bionica'
}
let MOCK_ID_UPDATE_AND_DELETE = ""

describe('SUITE DE TESTES MONGODB', function() {
    this.beforeAll(async() => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroSchema))
    })
    it('Verificar a Conexao', async() => {
        const result = await context.isConnected()
        assert.deepEqual(result, 'Conectado')
    })
    it('Listar  usuário', async() => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_USER.nome })
        const result = { nome, poder }
        assert.deepEqual(result, MOCK_USER)
    })
    it('Cadastrar  usuário', async() => {
        const { _id, nome, poder } = await context.create(MOCK_USER)
        MOCK_ID_UPDATE_AND_DELETE = _id
        assert.deepEqual({ nome, poder }, MOCK_USER)
    })
    it('Editar  usuário', async() => {
        MOCK_USER_UPDATE = {
            ...MOCK_USER,
            nome: "PAULAO"
        }
        const result = await context.update(MOCK_ID_UPDATE_AND_DELETE, MOCK_USER_UPDATE)
        assert.deepEqual(result.nModified, 1)
    })
    it('Deletar  usuário', async() => {
        const result = await context.delete(MOCK_ID_UPDATE_AND_DELETE)
        assert.deepEqual(result.n, 1)
    })

})