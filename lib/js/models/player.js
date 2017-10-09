const Backbone = require('backbone')
var socket = require('../services/socket')

exports.Player = Backbone.Model.extend ({

  defaults: {
    state: 'nonMember'
  },

  sendMessage: function ({ message, callback }) {
    socket.broadcastTo({ to: this.get('id'), data: message, callback })
  },

  sendInviteToGame: function ({ gameID }) {
    this.sendMessage({ message: { status: 'wanna-join', gameID }, callback: () => this.set('state', 'invited') })
  }
})