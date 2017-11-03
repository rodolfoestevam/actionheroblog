const {api,Action} = require('actionhero')
const jwt = require('jsonwebtoken')


exports.authentication = class Authentication extends Action {
    constructor() {
        super()
        this.name = 'authentication'
        this.description = 'an actionhero to authenticate the user'
        this.outputExample = {}
        this.authenticated = false
        this.inputs = {
            userName: {
                required: true
            },
            password: {
                required: true
            }
        }
    }
    async run({
        response,
        params
    }) {
        //response.authenticated = await api.users.authenticate(params.userName, params.password)
        let token, authenticated;
        authenticated = await api.users.authenticate(params.userName, params.password)
        if (!authenticated) {
            throw new Error('Unable to log in')
        } else {
            token = jwt.sign({
                user: await api.users.find(params.userName),
            }, 'secretkey', {
                expiresIn: 60 * 60
            });
            response.token = token;
        }
    }
}