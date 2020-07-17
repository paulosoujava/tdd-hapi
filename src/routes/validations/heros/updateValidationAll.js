const Joi = require("@hapi/joi")


class CreateValidation {
    static authValidatConfig() {
        return {
            headers: require('./../base/headers'),
            failAction: require('./../base/failAction'),
            params: Joi.object({
                id: Joi.string().required()
            }).label('PARAMS_TO_UPDATE'),
            payload: Joi.object({
                nome: Joi.string().min(3).max(100).required(),
                poder: Joi.string().min(3).max(100).required(),
            }).label('PAYLOAD_TO_UPDATE')
        }
    }
}

module.exports = CreateValidation