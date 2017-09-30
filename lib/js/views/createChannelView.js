const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var socket = require('../api/apiSocket')
var API = require('../api/apiGen')

var { playerView } = require('./playerView')

exports.createChannelView = Backbone.View.extend ({
  id: 'channel-view',
  className: 'grid-x',

  template: _.template (`
    <div class="small-3 cell">
      <div class="back-btn expanded button hollow">Back</div>
      <div class="players-window small-12 cell">
        <h3>Invite Player</h3>
        <div class="players-list"></div>
      </div>
    </div>
    <div class="small-8 small-offset-1 cell">
      <div class="cancel-btn expanded button hollow">Cancel</div>

      <h3>Game Settings</h3>
      <form class="channel-settings-wrapper small-12 cell">
        <input type="text" name="channel_name" placeholder="Channel Name"/>
        <input type="number" name="player_limit" placeholder="Max number of player"/>
      </form>

      <h3>Players</h3>
      <div class="member-players-list"></div>

      <div class="start-btn expanded button hollow">Start</div>
    </div>
  `),

  events: {
    'click .back-btn'  : 'returnToHomePage',
    'click .cancel-btn': 'cancelGame',
    'click .start-btn' : 'startGame'
  },

  initialize: function (options) {
    this.app = options.app
    this.store = this.app.store
    this.$wrapper = options.$wrapper

    this._createGame()

    this._render()
    this._renderPlayers()
  },

  _renderPlayers: function () {
    this.store.players.each ((player) => {
      if (player.get('status') === 'online') {
        new playerView ({
          state: player.get('state'), model: player, $nonMemberWrapper: this.playerList, $memberWrapper: this.playerMemberList
        })
      }
    })
  },

  _createGame: function () {
    API.createGame().then( (response) => {
      this.currentGame = new this.store.games.model (_.extend( response, { ownerID: this.app.currentAccount.get('id') } ))
      this.store.games.add( this.currentGame )
    })
  },

  returnToHomePage: function () {
    this.app.trigger('main-board-page')
  },

  cancelGame: function () {
    if (this.currentGame) {
      API.deleteGame( this.currentGame.get('gameID')).then( () => this.returnToHomePage() )
    }
  },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )

    this.playerList = this.$('.players-list')
    this.playerMemberList = this.$('.member-players-list')
  },

  _formData: function () {
    let rawData = this.$('form').serializeArray()
    return _( rawData ).reduce((accumulator, obj) => { (accumulator[obj.name] = obj.value) && accumulator }, {})
  }
})
