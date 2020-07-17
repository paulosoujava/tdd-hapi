const Joi = require("@hapi/joi")


class RecoveryValidation {
    static recoveryValidatConfig() {
        return {
            failAction: (request, headers, error) => {
                return error
            },
            payload: Joi.object({
                id: Joi.string().required(),
                password: Joi.string().required(),
            }).label("PASSWORD_RECOVERY")
        }
    }
}

module.exports = RecoveryValidation