const Joi = require("@hapi/joi")


class DeleteValidation {
    static authValidatConfig() {
        return {
            headers: require('./../base/headers'),
            failAction: require('./../base/failAction'),
            params: Joi.object({
                id: Joi.string().required()
            }).label('PARAMS_TO_DELETE'),
        }
    }
}
module.exports = DeleteValidation