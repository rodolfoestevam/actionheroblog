exports.default = {
  routes: function (api) {
    return {

      get: [
        { path : '/users', action: 'usersList' },
        { path : '/comments/:userName/:title', action: 'commentsView' },
        { path : '/post/:userName/:title', action: 'postView' },
        { path : '/posts/:userName', action: 'postsList' },
      ],

      post: [
        { path : '/authenticate', action: 'authenticate' },
        { path : '/user', action: 'userAdd' },
        { path : '/comment/:userName/:title', action: 'commentAdd' },
        { path : '/post/:userName', action: 'postAdd' },
      ],

      put: [
        { path : '/post/:userName', action: 'postEdit' },
      ],

      delete: [
        { path : '/user/:userName', action: 'userDelete' },
        { path : '/comment/:userName/:title/:commentId', action: 'commentDelete' },
        { path : '/post/:userName/:title', action: 'postDelete' },
      ]
      /* ---------------------
      routes.js

      For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
      If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.

      Learn more here: http://www.actionherojs.com/docs/#routes

      examples:

      get: [
        { path: '/users', action: 'usersList' }, // (GET) /api/users
        { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
      ],

      post: [
        { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
      ],

      all: [
        { path: '/user/:userID', action: 'user', matchTrailingPathParts: true } // (*) /api/user/123, api/user/123/stuff
      ]

      ---------------------- */

    }
  }
}
