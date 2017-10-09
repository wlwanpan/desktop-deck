const Backbone = require('backbone')
const _ = require('underscore')

var API = require('../services/api')

var { Game } = require('../models/game')

exports.Games = Backbone.Collection.extend ({
  model: Game,

  loadGame: function ({ gameID, callback }) {
    API.getGame( gameID ).then( (response) => {
      this.add( response )
      callback( this.get(gameID) )
    })
  },

  createGame: function ({callback}) {
    API.createGame().then( (response) => {
      this.add( response )
      callback( this.get(response.id) )
    })
  },

  deleteGame: function ({ gameID, callback }) {
    API.deleteGame( gameID ).then ( (response) => {
      this.get( gameID ).resetPlayers()
      this.remove( gameID )
      callback()
    })
  },

})