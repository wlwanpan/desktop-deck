const Backbone = require('backbone')
const _ = require('underscore')

var API = require('../api/apiGen')
var socket = require('../api/apiSocket')

var { Players } = require('../collections/players')
var { Games } = require('../collections/games')

exports.Store = Backbone.Model.extend ({

  initialize: function () {
    this.players = new Players()
    this.games = new Games()

    this._initStoreSync()
  },

  loadGame: function (options) {
    var { gameID, callback } = options
    API.getGame( gameID ).then( (response) => {
      this.games.add( response )
      callback( this.games.get(gameID) )
    })
  },

  createGame: function (callback) {
    API.createGame().then( (response) => {
      let newGame = new this.games.model( response )
      this.games.add( newGame )
      callback( newGame )
    })
  },

  deleteGame: function (options) {
    var { gameID, callback } = options
    API.deleteGame( gameID ).then ( () => {
      this.games.get( gameID ).resetPlayers()
      this.games.remove( gameID )
      callback()
    })
  },

  refreshOnlinePlayers: function () {
    socket.broadcastTo({ tunnel: 'global', data: {status: 'who-is-on'} })
  },

  _initStoreSync: function () {
    socket.subscribeTo({ tunnel: 'global', callback: (response) => this._globalDataRequest(response) })
  },

  _globalDataRequest: function (response) {
    var { from, data: { username, status, replyChannel }} = response
    switch ( status ) {
      case 'who-is-on':
        socket.broadcastTo({ tunnel: 'global', data: {status: 'online'} })
        break
      case 'online':
        this.players.add ({ id: from, username, status, replyChannel })
        break
      case 'offline':
        offlinePlayer = this.players.get(from)
        offlinePlayer.set('state', 'offline')
        this.players.remove( offlinePlayer )
        break
    }
  }
})