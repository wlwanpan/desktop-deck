const Backbone = require('backbone')
const _ = require('underscore')
var socket = require('../services/socket')

var { Player } = require('../models/player')

exports.Players = Backbone.Collection.extend ({
  model: Player,

  refreshOnlinePlayers: function () {
    socket.broadcastTo({ to: 'global', data: {status: 'who-is-on'} })
  },

})