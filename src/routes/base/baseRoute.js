class BaseRoutes {
    static methods() {
        return Object.getOwnPropertyNames(this.prototype)
            .filter(m => m !== 'constructor' && !m.startsWith('_'))
    }
}

module.exports = BaseRoutes