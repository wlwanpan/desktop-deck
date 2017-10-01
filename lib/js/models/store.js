const Backbone = require('backbone')
const _ = require('underscore')

var API = require('../api/apiGen')
var socket = require('../api/apiSocket')

var { Players } = require('../collections/players')
var { Games } = require('../collections/games')

exports.Store = Backbone.Model.extend ({
  defaults: {

  },
  initialize: function () {
    this.players = new Players()
    this.games = new Games()

    this._initStoreSync()
  },

  loadGame: function (options) {
    var { gameID, callback } = options
    API.getGame(gameID).then((response) => {
      this.games.add( response )
      callback( this.games.get(gameID) )
    })
  },

  _initStoreSync: function () {
    socket.subscribeTo({ tunnel: 'global', callback: (response) => this._globalDataRequest(response) })
  },

  _globalDataRequest: function (response) {
    var { from, replyChannel, data: { username, status }} = response
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