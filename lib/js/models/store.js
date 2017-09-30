const Backbone = require('backbone')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')
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
  _initStoreSync: function () {
    socket.subscribeTo({ tunnel: 'global', callback: (response) => this._playersUpdater(response) })
  },
  _playersUpdater: function (response) {
    var { from, replyChannel, data: { username, status }} = response
    switch ( status ) {
      case 'online':
        this.players.add ({ id: from, username, status, replyChannel })
        break
      case 'offline':
        this.players.remove (from)
        break
    }
  }
})