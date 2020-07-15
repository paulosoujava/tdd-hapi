const Bcrypt = require('bcrypt')
const {
    promisify
} = require('util')
const SALT = parseInt(process.env.SALT)
const hashAsync = promisify(Bcrypt.hash)
const compareAsync = promisify(Bcrypt.compare)

class PasswordHelper {
    static hashPassword(pass) {
        return hashAsync(pass, SALT)
    }
    static comparePassword(pass, hash) {
        return compareAsync(pass, hash)
    }
}

module.exports = PasswordHelper