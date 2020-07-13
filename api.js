const Hapi = require('@hapi/hapi');
const AppRoute = require('./src/routes/appRoutes')

//MONGO
const Context = require('./src/db/base/context');
const MongoDB = require('./src/db/mongo/mongo');
const HeroSchema = require('./src/db/mongo/schemas/heroSchema');

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(m => instance[m]())
}


async function main() {

    // ** INIT MONGO
    const connection = MongoDB.connect()
    const mongoDb = new Context(new MongoDB(connection, HeroSchema))


    app.route([
        ...mapRoutes(new AppRoute(mongoDb), AppRoute.methods())
    ])

    await app.start()
    console.log(`Server running on port ${app.info.port}`);
    return app
}
module.exports = main()