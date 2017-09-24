const Backbone = require('backbone')
var socket = require('../api/apiSocket')

exports.Player = Backbone.Model.extend ({
  defaults: {
    shoutout: undefined,
    replyChannel: undefined
  },
  requestGame: function () {
    socket.broadcastTo({ tunnel: this.get('replyChannel'), data: { status: 'wanna-join' }})
  }

})