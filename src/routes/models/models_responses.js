Joi = require("@hapi/joi")
class Models {
    static schema(witch, route) {
        switch (route) {
            case 'AUTH':
                return require('./auth').authReturns(witch)
            case 'HERO':
                return require('./heros').heroReturns(witch)
        }

    }

    static description(witch, route) {
        switch (route) {
            case 'AUTH':
                return require('./auth').authDesctiptions(witch)
            case 'HERO':
                return require('./heros').heroReturns(witch)
        }

    }
    static tags(witch, route) {
        switch (route) {
            case 'HERO':
                return require('./heros').heroApiTags(witch)
        }
    }
    static config(route, witch) {
        switch (route) {
            case 'HERO':
                return require('./heros').configSwaggerAndValidation(witch)
        }
    }

}
module.exports = Models