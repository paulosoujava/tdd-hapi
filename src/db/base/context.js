  const ICrud = require('./../interface/interfaceCrud')

  class Context extends ICrud {
      constructor(context) {
          super()
          this._database = context
      }

      create(item) {
          return this._database.create(item)
      }
      read(query, skip, limit) {
          return this._database.read(query, skip, limit)
      }
      update(id, item, upsert) {
          return this._database.update(id, item, upsert)
      }
      delete(id) {
          return this._database.delete(id)
      }
      isConnected() {
          return this._database.isConnected()
      }
      connect() {
          return this._database.connect()
      }
  }

  module.exports = Context