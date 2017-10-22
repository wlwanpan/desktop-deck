const Backbone = require('backbone')
const _ = require('underscore')

const API = require('../services/api')
const socket = require('../services/socket')

const { Players } = require('../collections/players')

exports.Game = Backbone.Model.extend ({

  defaults: {
    ownerID: undefined,
    state: 'pending',
    settings: {}
  },

  initialize: function () {
    this.players = new Players()
    this.messages = new Backbone.Collection()
  },

  updateState: function ({ from, message, flag }) {
    switch ( flag ) {
      case 'chat-room':
        this.messages.add({from, message})
        break
      case 'game-state':
        console.log (this)
        if (message === 'start-game') { this.app.trigger('game-board-page') }
        break
    }
  },

  publishTo: function ({ message, flag }) {
    socket.broadcastToGame({ gameID: this.get('id'), data: { message, flag } })
  },

  setSettings: function () {

  },

  resetPlayers: function () {
    this.players.each((player) => player.set('state', 'nonMember'))
  },

  registerPlayerToChannel: function ({ playerID, callback }) {
    API.updateGame( this.get('id'), { member: [playerID] } ).then( callback )
  }

})