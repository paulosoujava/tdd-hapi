const assert = require('assert'),
    PasswordHelp = require('./../src/helpers/passwordHelper')

const PASSWORD = 'Paulo@123'
const HASH_PASSWORD = '$2b$04$mq3/zevQkwhDovivvZRvqOQ6srVtTdIAmwCQFQOOrzxknGXAp.9ny'

describe('PasswordHelp test suit', function() {

    it('Deve gerar um hash a partir de uma senha', async() => {
        const result = await PasswordHelp.hashPassword(PASSWORD)
        assert.ok(result.length > 10)
    })
    it('Deve validar a senha e seu hash', async() => {
        const result = await PasswordHelp.comparePassword(PASSWORD, HASH_PASSWORD)
        assert.ok(result)
    })
})