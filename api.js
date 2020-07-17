const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === 'prod' || env == 'dev', "a env é invalida!!")

const confiPath = join(__dirname, "./config", `.env.${env}`)
config({
    path: confiPath
})

const Hapi = require('@hapi/hapi');
const AppRoute = require('./src/routes/appRoutes')
const AuthRoutes = require('./src/routes/authRoutes')


//JWT
const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = process.env.JWT_KEY

//SWAGGER
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');



//MONGO
const Context = require('./src/db/base/context');
const MongoDB = require('./src/db/mongo/mongo');
const HeroSchema = require('./src/db/mongo/schemas/heroSchema');
const AuthSchema = require('./src/db/mongo/schemas/authSchema');


const app = new Hapi.Server({ port: process.env.PORT })

function mapRoutes(instance, methods) {
    return methods.map(m => instance[m]())
}


async function main() {

    // ** INIT MONGO
    const connection = MongoDB.connect()
    const mongoDb = new Context(new MongoDB(connection, HeroSchema))
    const authDb = new Context(new MongoDB(connection, AuthSchema))



    //REGISTER SWAGGER
    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: '1.0.3',
            contact: {
                name: 'Paulo Oliveira',
                email: 'paulosoujava@gmail.com'
            },

        }
    }
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    //STRATEGY
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        validate: async(dado, request) => {
            //verificacoes no banco se usuario continua ativo, se pagamento em dia etc...
            //console.log("DADOS", dado);
            if (Date.now() >= dado.exp * 1000) {
                //console.log("DATA", Date.now());
                //console.log("IAt", dado.exp * 1000);
                //console.log("TESTE", (Date.now() >= dado.exp * 1000));
                return { isValid: false }
            }
            const [result] = await authDb.read({ username: dado.user, })
            return { isValid: (result ? true : false) }
        },
        verifyOptions: { algorithms: ['HS256'] }
    })
    app.auth.default('jwt')


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