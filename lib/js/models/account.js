const Backbone = require('backbone')
const _ = require('underscore')

var API = require('../api/apiGen')
var socket = require('../api/apiSocket')

exports.Account = Backbone.Model.extend ({
  defaults: {
    store: undefined,
    privateChannel: []
  },
  constructor: function (options) {
    if (options.token) {
      API.storeToken (options.token)
      API.setToken (options.token)
    }
    Backbone.Model.apply(this, arguments)
  },
  initialize: function (options) {
    let { channelID, token } = options
    if (channelID) { socket.subscribeTo ({ token, tunnel: channelID,
        callback: (response) => this._updatePrivateChannel(response)
      })
    }
    else {
      console.log ('Account has no private channel: channelID missing')
    }
  },
  _updatePrivateChannel: function (message) {
    var { from, data: { status, username, gameID } } = message
    var senderModel = this.get('store').players.get(from)

    switch ( status ) {
      case 'wanna-join':
        this.get('app').renderNotification ({ description: `${username}(${from}): wanna join?`,
          accept: () => {
            senderModel.sendMessage({ message: { status: 'accepted-invitation' } })
            this.get('store').loadGame({ gameID, callback: (gameModel) => {
                this.get('app').trigger ('member-channel-page', gameModel)
              }
            })
          },
          reject: () => {
            senderModel.sendMessage({ message: { status: 'rejected-invitation' } })
          }
        })
        break
      case 'accepted-invitation':
        senderModel.set('state', 'member')
        break
      case 'rejected-invitation':
        senderModel.set('state', 'nonMember')
        break
    }
  }
})