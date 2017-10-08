const Backbone = require('backbone')
const _ = require('underscore')

var API = require('../services/api')
var socket = require('../services/socket')

exports.Account = Backbone.Model.extend ({
  defaults: {
    currentGame: undefined
  },
  constructor: function ({ token }) {
    if (token) {
      API.storeToken (token)
      API.setToken (token)
    }
    Backbone.Model.apply(this, arguments)
  },

  initialize: function ({ app, channel_id, token }) {
    this.app = app
    // try: this._updateGlobalChannel.bind(this, response)
    socket.subscribeTo({ to: 'global', callback: (response) => this._updateGlobalChannel(response) })
    // if channelid present init private channel
    if (channel_id) { socket.subscribeTo ({ token, tunnel: channel_id,
        callback: (response) => this._updatePrivateChannel(response)
      })
    }
    else {
      console.log ('Account has no private channel: channelID missing')
    }
  },
  // private channel packet distributor
  _updatePrivateChannel: function ({ from, data }) {
    console.log ('from private channel')
    console.log (data)
    var { status, gameID } = data
    var senderModel = this.app.players.get(from)

    switch ( status ) {
      case 'wanna-join':
        this.app.renderNotification ({ description: `${username}(${from}): wanna join?`,
          accept: () => {
            senderModel.sendMessage({ message: { status: 'accepted-invitation' } })
            this.app.games.loadGame({ gameID, callback: (gameModel) => {
                app.currentGame = gameModel
                app.trigger ('member-channel-page')
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
  },
  _updateGlobalChannel: function ({ from, data }) {
    console.log ('from global data request')
    console.log (data)
    var { status } = data
    switch ( status ) {
      case 'who-is-on':
        socket.broadcastTo({ to: 'global', data: {status: 'online'} })
        break
      case 'online':
        this.app.players.add ({ id: from, username, status, replyChannel })
        break
      case 'offline':
        this.app.players.remove( from )
        break
    }
  }
})