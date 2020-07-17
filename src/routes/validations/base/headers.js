const Joi = require("@hapi/joi")
module.exports = Joi.object({
    authorization: Joi.string().required()
}).unknown()