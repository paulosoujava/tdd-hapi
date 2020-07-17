const Joi = require("@hapi/joi")


class AuthValidation {
    static authValidatConfig() {
        return {
            failAction: (request, headers, error) => {
                return error
            },
            payload: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            }).label("PAYLOAD_LOGIN")
        }
    }
}

module.exports = AuthValidation