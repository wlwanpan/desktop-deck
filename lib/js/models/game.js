const Backbone = require('backbone')
const _ = require('underscore')

const API = require('../services/api')
const socket = require('../services/socket')

const { Players } = require('../collections/players')

exports.Game = Backbone.Model.extend ({

  defaults: {
    ownerID: undefined,
    messages: [],
    settings: {}
  },

  initialize: function () {
    this.players = new Players()
  },

  updateState: function ({ from, message, flag }) {
    switch ( flag ) {
      case 'chat-room':
        // To continuer here wire change in state between game model and chatRoomView
        // chatRoomView is not detecting model change in this mode here
        this.get('messages').push({from, message})
        break
      case 'game-state':
        break
    }
  },

  publishToChat: function ({ message }) {
    socket.broadcastToGame({ gameID: this.get('id'), data: { message, flag: 'chat-room'} })
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