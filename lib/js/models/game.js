const Backbone = require('backbone')

var socket = require('../api/apiSocket')
var API = require('../api/apiGen')

var { Players } = require('../collections/players')

exports.Game = Backbone.Model.extend ({

  defaults: {
    channelID: undefined,
    ownerID: undefined
  },

  initialize: function () {
    this.players = new Players()
  },

  registerPlayerToChannel: function (options) {
    API.updateGame( this.get('id'), { member: [options.playerID] } ).then( () => options.callback() )
  }

})