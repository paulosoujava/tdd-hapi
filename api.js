const Hapi = require('@hapi/hapi');
const AppRoute = require('./src/routes/appRoutes')
const AuthRoutes = require('./src/routes/authRoutes')


//JWT
const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'mabru'

//SWAGGER
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        version: 'v1',

    },
};


//MONGO
const Context = require('./src/db/base/context');
const MongoDB = require('./src/db/mongo/mongo');
const HeroSchema = require('./src/db/mongo/schemas/heroSchema');
const AuthSchema = require('./src/db/mongo/schemas/authSchema');

const app = new Hapi.Server({
    port: 5000
})



function mapRoutes(instance, methods) {
    return methods.map(m => instance[m]())
}


async function main() {


    //REGISTER
    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    //STRATEGY
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 3000
        // },
        validate: async(dado, request) => {
            //console.log("DADOS STRATEGY", dado);
            const [result] = await authDb.read({
                    username: dado.username
                })
                //aqui serve para verificar se a sessão continua ativa
                //se o usuário continua ativo
                //  console.log("ISVALID", (result ? true : false));
            return { isValid: result ? true : false }

        }
    })
    app.auth.default('jwt')

    // ** INIT MONGO
    const connection = MongoDB.connect()
    const mongoDb = new Context(new MongoDB(connection, HeroSchema))
    const authDb = new Context(new MongoDB(connection, AuthSchema))


    app.route([
        ...mapRoutes(new AppRoute(mongoDb), AppRoute.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, authDb), AuthRoutes.methods())
    ])

    await app.start()
    console.log(`Server running on port ${app.info.port}`);


    // app.events.on('response', (request) => {
    //     console.log(`Response sent for request: ${request.route.method}`);
    //     console.log(`Response sent for request: ${request.route.path}`);
    //     console.log(`Response sent for request: ${request.url}`);
    //     console.log(`Response sent for request: ${request.info.hostname}`);
    // });


    return app
}
module.exports = main()