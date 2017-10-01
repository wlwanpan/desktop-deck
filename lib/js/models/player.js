const Backbone = require('backbone')
var socket = require('../api/apiSocket')

exports.Player = Backbone.Model.extend ({

  defaults: {
    state: 'nonMember',
    replyChannel: undefined
  },

  sendMessage: function (options) {
    var { message, callback } = options
    socket.broadcastTo({ tunnel: this.get('replyChannel'), data: message, callback })
  },

  sendInviteToGame: function (gameID) {
    this.sendMessage({ message: { status: 'wanna-join', gameID }, callback: () => this.set('state', 'invited') })
  }
})