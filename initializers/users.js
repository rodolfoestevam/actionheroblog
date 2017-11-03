const { Initializer, api} = require('actionhero')
const bcrypt = require('bcrypt')

module.exports = class Users extends Initializer {
  constructor() {
    super()
    this.name = 'users'
    this.saltRounds = 10
    this.usersHash = 'users'
  }

  async initialize() {
    const redis = api.redis.clients.client

    // const middleware = {
    //     name: 'userId checker',
    //     global: false,
    //     priority: 1000,
    //     preProcessor: (data) => {
    //         if(!data.params.userId){
    //         throw new Error('All actions require a userId')
    //         }
    //     },
    //     postProcessor (data) => {
    //         if(data.thing.stuff == false){ data.toRender = false }
    //     }
    // }

    // api.actions.addMiddleware(middleware)

    api.users = {}

    api.users.add = async(userName, password) => {
      const savedUser = await redis.hget(this.usersHash, userName)
      if (savedUser) {
        throw new Error('userName already exists')
      }
      const hashedPassword = await api.users.cryptPassword(password)
      const data = {
        userName: userName,
        hashedPassword: hashedPassword,
        createAt: new Date().getTime()
      }
      await redis.hset(this.usersHash, userName, JSON.stringify(data))
    }

    api.users.list = async() => {
      const userData = await redis.hgetall(this.usersHash)
      return Object.keys(userData).map((k) => {
        let data = JSON.parse(userData[k])
        delete data.hashedPassword
        return data
      })
    }

    api.users.find = async(userName) => {
      try {
        let data = await redis.hget(this.usersHash, userName)
        let dataUser = JSON.parse(data);
        delete dataUser.hashedPassword;
        return dataUser;
      } catch (error) {
        throw new Error(`userName does not exists (${error})`)
      }
    }

    api.users.authenticate = async(userName, password) => {
      try {
        let data = await redis.hget(this.usersHash, userName)
        data = JSON.parse(data)
        return api.users.comparePassword(data.hashedPassword, password)
      } catch (error) {
        throw new Error(`userName does not exists (${error})`)
      }
    }

    api.users.delete = async(userName, password) => {
      await redis.del(this.usersHash, userName)
      const titles = await api.blog.listUserPosts(userName)
      for (let i in titles) {
        await api.blog.deletePost(userName, titles[i])
      }
    }

    api.users.cryptPassword = async(password) => {
      return bcrypt.hash(password, this.saltRounds)
    }

    api.users.comparePassword = async(hashedPassword, userPassword) => {
      return bcrypt.compare(userPassword, hashedPassword)
    }

  }
  
  //async start() {}
  //async stop() {}
}