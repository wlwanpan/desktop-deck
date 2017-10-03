const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var socket = require('../api/apiSocket')
var API = require('../api/apiGen')

var { playerView } = require('./playerView')
var { chatRoomView } = require('./chatRoomView')

exports.createChannelView = Backbone.View.extend ({
  id: 'create-channel-view',
  className: 'grid-x',

  template: _.template (`
    <div class="small-2 cell">
      <div class="back-btn button round-btn">Back</div>
      <div class="players-window small-12 cell">
        <h3>Invite Player</h3>
        <div class="refresh-btn button round-btn">Refresh</div>
        <div class="players-list"></div>
      </div>
    </div>
    <div class="small-6 cell">
      <div class="cancel-btn expanded button round-btn">Cancel</div>

      <h3>Game Settings</h3>
      <form class="channel-settings-wrapper small-12 cell">
        <input type="text" name="channel_name" placeholder="Channel Name"/>
        <input type="number" name="player_limit" placeholder="Max number of player"/>
      </form>

      <h3>Players</h3>
      <div class="member-players-list"></div>

      <div class="start-btn expanded button round-btn">Start</div>
    </div>

    <div class="chat-room-wrapper small-4 cell"></div>
  `),

  events: {
    'click .back-btn'   : 'returnToHomePage',
    'click .refresh-btn': 'refreshPlayerList',
    'click .cancel-btn' : 'cancelGame',
    'click .start-btn'  : 'startGame'
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
    new playerView ({
      state: player.get('state'), currentGame: this.currentGame, model: player,
      $nonMemberWrapper: this.playerList, $memberWrapper: this.playerMemberList
    })
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

  refreshPlayerList: function (e) {
    e.preventDefault()
    this.store.refreshOnlinePlayers()
    $(e.currentTarget).addClass('disabled-btn')
    setTimeout( () => { $(e.currentTarget).removeClass('disabled-btn') }, 500)
  },

  cancelGame: function () {
    if ( this.currentGame ) {
      this.store.deleteGame ({ game: this.currentGame, callback: () => {
          this.currentGame = undefined
          this.returnToHomePage()
        }
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
