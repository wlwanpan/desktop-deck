const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var socket = require('../api/apiSocket')
var API = require('../api/apiGen')

var { playerView } = require('./playerView')
var { chatRoomView } = require('./chatRoomView')

exports.createChannelView = Backbone.View.extend ({
  id: 'channel-view',
  className: 'grid-x',

  template: _.template (`
    <div class="small-2 cell">
      <div class="back-btn expanded button hollow">Back</div>
      <div class="players-window small-12 cell">
        <h3>Invite Player</h3>
        <div class="players-list"></div>
      </div>
    </div>
    <div class="small-6 cell">
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

    <div class="chat-room-wrapper small-4 cell">

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

    API.createGame().then( (response) => {
      this._loadCurrentGame (response)

      this._render()
      this._renderPlayers()
      this._renderChatRoom()

      this._initListeners()
    })
  },

  _initListeners: function () {
    this.listenTo(this.store.players, 'add', this._renderPlayer)
  },

  _renderPlayers: function () {
    this.store.players.each( (player) => this._renderPlayer(player) )
  },

  _renderPlayer: function (player) {
    if (player.get('status') === 'online') { new playerView ({
        state: player.get('state'), currentGame: this.currentGame, model: player,
        $nonMemberWrapper: this.playerList, $memberWrapper: this.playerMemberList
      })
    }
  },

  _renderChatRoom: function () {
    new chatRoomView ({ model: this.currentGame, $wrapper: this.chatRoomWrapper })
  },

  _loadCurrentGame: function (data) {
    this.currentGame = new this.store.games.model ( data )
    this.store.games.add( this.currentGame )
  },

  returnToHomePage: function () {
    this.app.trigger('main-board-page')
  },

  cancelGame: function () {
    if ( this.currentGame ) {
      API.deleteGame( this.currentGame.get('id') ).then ( () => {
        // unset player state to 'nonMember'
        this.store.games.remove( this.currentGame )
        this.currentGame = undefined
        this.returnToHomePage()
      })
    }
  },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )

    this.chatRoomWrapper = this.$('.chat-room-wrapper')
    this.playerList = this.$('.players-list')
    this.playerMemberList = this.$('.member-players-list')
  },

  _formData: function () {
    return _( this.$('form').serializeArray() ).reduce(
      (accumulator, obj) => { (accumulator[obj.name] = obj.value) && accumulator }, {}
    )
  }
})
