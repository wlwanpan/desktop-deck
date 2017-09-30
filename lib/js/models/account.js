const Backbone = require('backbone')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')
var socket = require('../api/apiSocket')

exports.Account = Backbone.Model.extend ({
  defaults: {
    store: undefined,
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
    if (channelID) { socket.subscribeTo ({
        token, tunnel: channelID,
        callback: (response) => this._updatePrivateChannel(response)
      })
    }
    else {
      console.log ('Account has no private channel: channelID missing')
    }
  },
  _updatePrivateChannel: function (message) {
    var { from, data: { status, username } } = message
    var app = this.get('app')
    switch ( status ) {

      case 'wanna-join':
        app.renderNotification ({
          description: `${username}(${from}): wanna join?`,
          accept: () => {
            console.log ('accepted invitation')
          },
          reject: () => {
            console.log ('rejected invitation')
          }
        })
    }
    // console.log(this.get('store').players.findWhere({ id: data.from }))
  }
})