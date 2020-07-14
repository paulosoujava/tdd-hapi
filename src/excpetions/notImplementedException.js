/* istanbul ignore next */
class NotImplementedException extends Error {
    constructor() {
        super('Not impletented Exception')
    }
}

module.exports = NotImplementedException