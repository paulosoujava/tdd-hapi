const Joi = require("@hapi/joi")

class CreateValidation {
    static authValidatConfig() {
        return {
            headers: require('./../base/headers'),
            failAction: require('./../base/failAction'),
            payload: Joi.object({
                nome: Joi.string().min(3).max(100).required(),
                poder: Joi.string().min(3).max(100).required(),
            }).label("PAYLOAD_USER")
        }
    }
}

module.exports = CreateValidation