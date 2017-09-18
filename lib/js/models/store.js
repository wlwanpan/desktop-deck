const Backbone = require('backbone')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')
var socket = require('../api/apiSocket')

var { Players } = require('../collections/players')

exports.Store = Backbone.Model.extend ({

  defaults: {},
  
  initialize: function () {
    this.players = new Players()
    this._initListeners()
  },

  _initListeners: function () {
    socket.subscribeTo( 'status', (response) => {
      console.log (response)
      var { from, username, data } = response
      this.players.add ({ id: from, username, status: data.status })
    })
  }
})