const Backbone = require('backbone')
const _ = require('underscore')

const API = require('../services/api')
const socket = require('../services/socket')

exports.Account = Backbone.Model.extend ({
  defaults: {
    currentGame: undefined
  },
  constructor: function ({ token }) {
    if (token) { API.storeToken (token),  API.setToken (token) }
    Backbone.Model.apply(this, arguments)
  },

  initialize: function ({ app, channel_id, token }) {
    this.app = app
    socket.subscribeTo({ to: 'global', callback: (response) => this._updateGlobalChannel(response) })
    // if channelid present init private channel
    if (channel_id) {
      socket.subscribeTo ({ token, to: channel_id,
        callback: (response) => this._updatePrivateChannel(response)
      })
    }
    else {
      console.log ('Account has no private channel: channelID missing')
    }
  },
  // private channel packet distributor
  _updatePrivateChannel: function ({ from, data }) {
    var sender = this.app.players.get(from)
    var game = this.app.games.get(data.gameID)
    switch ( data.status ) {
      case 'wanna-join':
        this.app.renderNotification ({ description: `${sender.get('username')}(${from}): wanna join?`,
          accept: () => {
            sender.sendMessage({ message: { status: 'accepted-invitation' } })
            this.app.games.loadGame({ gameID: data.gameID, callback: (gameModel) => {
                this.app.currentGame = gameModel
                this.app.trigger ('member-channel-page')
              }
            })
          },
          reject: () => {
            sender.sendMessage({ message: { status: 'rejected-invitation' } })
          }
        })
        break
      case 'accepted-invitation':
        sender.set('state', 'member')
        break
      case 'rejected-invitation':
        sender.set('state', 'nonMember')
        break
      case 'game-channel':
        if (game) { game.updateState(_.extend( _.omit(data, ['status', 'gameID']), {from: sender.get('username')} ) )}
        break
    }
  },
  _updateGlobalChannel: function ({ from, data }) {
    switch ( data.status ) {
      case 'who-is-on':
        socket.broadcastTo ({ to: 'global', data: {
          status: 'online', id: this.id, username: this.get('username')}
        })
        break
      case 'online':
        this.app.players.add ( data )
        break
      case 'offline':
        this.app.players.remove( from )
        break
    }
  }
})