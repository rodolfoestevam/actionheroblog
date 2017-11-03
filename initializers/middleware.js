const {api, Initializer } = require('actionhero')
const jwt = require('jsonwebtoken')

module.exports = class JwtMiddleware extends Initializer {
    constructor() {
        super()
        this.name = 'jwt-middleware'
    }

    async initialize() {
        
    }
}