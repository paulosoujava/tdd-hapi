const Joi = require("@hapi/joi")


class EmailValidation {
    static emailValidatConfig() {
        return {
            failAction: (request, headers, error) => {
                return error
            },
            payload: Joi.object({
                email: Joi.string().min(3).required()
            }).label("EMAIL_FORGET")
        }
    }
}

module.exports = EmailValidation