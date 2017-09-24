const Backbone = require('backbone')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')
var socket = require('../api/apiSocket')

exports.Account = Backbone.Model.extend ({
  defaults: {
    privateChannel: []
  },
  constructor: function (options) {
    if (options.token) {
      AjaxCallback.storeToken (options.token)
      AjaxCallback.setToken (options.token)
    }

    Backbone.Model.apply(this, arguments)
  },
  initialize: function (options) {
    let { channelID, token } = options
    if (channelID) { socket.subscribeTo({
      token, tunnel: channelID, callback: (response) => this._updatePrivateChannel(response)
    }) }
  },
  _updatePrivateChannel: function (data) {
    console.log(data)
  }
})