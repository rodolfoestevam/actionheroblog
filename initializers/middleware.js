const {
  Initializer,
  api
} = require('actionhero')

module.exports = class AuthenticationMiddleware extends Initializer {
  constructor() {
    super()
    this.name = 'authentication_middleware'
  }

  async initialize() {
    const middleware = {
      name: this.name,
      global: true,
      preProcessor: async({
        actionTemplate,
        params
      }) => {
        if (actionTemplate.authenticated === true) {
          let match = await api.users.authenticate(params.userName, params.password)
          if (!match) {
            throw Error('Authentication Failed. Username and password required')
          }
        }
      }
    }

    api.actions.addMiddleware(middleware)
  }

  //async start () {}
  //async stop () {}
}