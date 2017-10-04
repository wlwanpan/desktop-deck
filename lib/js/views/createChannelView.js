const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

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

    this.app.currentGame ? this._afterInitialize() : this.store.createGame((newGame) => {
      newGame.players.add(this.app.currentAccount)
      this.app.currentGame = newGame
      this._afterInitialize()
    })
  },

  _afterInitialize: function () {
    this._render()
    this._renderPlayers()
    this._renderChatRoom()

    this._initListeners()
  },

  _initListeners: function () {
    this.listenTo(this.store.players, 'add', this._renderPlayer)
  },

  _renderPlayers: function () {
    this.store.players.each( (player) => this._renderPlayer(player) )
  },

  _renderPlayer: function (player) {
    new playerView ({
      state: player.get('state'), app: this.app, model: player,
      $nonMemberWrapper: this.playerList, $memberWrapper: this.playerMemberList
    })
  },

  _renderChatRoom: function () {
    new chatRoomView ({ model: this.app.currentGame, $wrapper: this.chatRoomWrapper })
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
    // refine this one !!! => move logic to somewhere else
    if ( this.app.currentGame ) {
      this.store.deleteGame ({ gameID: this.app.currentGame.get('id'), callback: () => {
          this.app.currentGame = undefined
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
