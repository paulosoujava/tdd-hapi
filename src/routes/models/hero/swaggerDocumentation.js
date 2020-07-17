class SwaggerDocumentation {
    static redirections(wich) {
        switch (wich) {
            case 'LIST':
                const conf = require('./swaggerList')
                return conf.configSwaggerAndValidation()
            case 'CREATE':
                return require('./swaggerCreate')
            case 'UPDATE':
                return require('./swaggerUpdate')
            case 'UPDATE_ALL':
                return require('./swaggerUpdateAll')
            case 'DELETE':
                return require('./swaggerDelete')
        }
    }
}
module.exports = SwaggerDocumentation