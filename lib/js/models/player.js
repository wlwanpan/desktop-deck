const Backbone = require('backbone')
var socket = require('../api/apiSocket')

exports.Player = Backbone.Model.extend ({

  defaults: {
    shoutout: undefined,
    replyChannel: undefined
  },

  sendMessage: function (options) {
    var { message, callback } = options
    socket.broadcastTo({ tunnel: this.get('replyChannel'), data: message, callback: callback })
  }

})