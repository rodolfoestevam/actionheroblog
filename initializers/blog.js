const {
  Initializer,
  api
} = require('actionhero')

module.exports = class Blog extends Initializer {
  constructor() {
    super()
    this.name = 'blog'
  }

  async initialize() {
    const redis = api.redis.clients.client

    api.blog = {
      //constants
      separator: ';',
      postPrefix: 'post',
      commentPrefix: 'comments:',
    }

    //posts
    api.blog.postAdd = async(userName, title, content) => {
      const key = api.blog.buildTitleKey(userName, title)
      const data = {
        content,
        title,
        userName,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      }
      await redis.hmset(key, data);
    }

    api.blog.postView = async(userName, title) => {
      const key = api.blog.buildTitleKey(userName, title)
      return redis.hgetall(key)
    }

    api.blog.postList = async(userName) => {
      const search = [api.blog.postPrefix, userName, '*'].join(api.blog.separator)
      const keys = await redis.keys(search)
      let titles = keys.map((key) => {
        let parts = key.split(api.blog.separator)
        return parts[(parts.length - 1)]
      })

      titles.sort()
      return titles
    }

    api.blog.postEdit = async(userName, title, content) => {
      const key = api.blog.buildTitleKey(userName, title)
      const data = await api.blog.postView(key)
      const newData = {
        content,
        title,
        userName,
        createdAt: data.createdAt,
        updatedAt: new Date().getTime()
      }
      await redis.hmset(key, newData)
    }

    api.blogpostDelete = async(userName, title) => {
      const key = api.blog.buildTitleKey(userName, title)
      await redis.del(key)
      const commentKey = api.blog.buildCommentKey(userName, title)
      await redis.del(commentKey)
    }

    //comments
    api.blog.commentAdd = async(userName, title, commenterName, comment) => {
      const key = api.blog.buildCommentKey(userName, title)
      const commentId = api.blog.buildCommentId(commenterName)
      const data = {
        comment,
        commenterName,
        createdAt: new Date().getTime(),
        commentId: commentId
      }
      await redis.hset(key, commentId, JSON.stringify(data))
    }

    api.blog.commentsView = async(userName, title) => {
      const key = api.blog.buildCommentKey(userName, title)
      const data = await redis.hgetall(key)
      const comments = Object.keys(data).map((key) => {
        let comment = data[key]
        return JSON.parse(comment)
      })
      return comment;
    }

    api.blog.commentsDelete = async(userName, title, commentId) => {
      const key = api.blog.buildCommentKey(userName, title)
      await redis.hdel(key, commentId)
    }

    api.blog.buildTitleKey = (userName, title) => {
      return api.blog.postPrefix + api.blog.separator + userName + api.blog.separator + title
    }

    api.blog.buildCommentKey = (userName, title) => {
      return api.blog.commentPrefix + api.blog.separator + userName + api.blog.separator + title
    }

    api.blog.buildCommentId = (commenterName) => {
      return commenterName + new Date().getTime()
    }
  }

  //  async start() {}
  //  async stop() {}
}