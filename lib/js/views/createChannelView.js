const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var { playerView } = require('./playerView')
var socket = require('../api/apiSocket')

exports.createChannelView = Backbone.View.extend ({
  id: 'channel-view',
  className: 'grid-x',

  template: _.template (`
    <div class="small-3 cell">
      <div class="players-window small-12 cell">
        <h3>Invite Player</h3>
        <div class="players-list"></div>
      </div>
    </div>
    <div class="small-8 small-offset-1 cell">
      <div class="back-btn expanded button hollow">Cancel</div>

      <form class="channel-settings-wrapper small-12 cell">
        <input type="text" name="channel_name" placeholder="Channel Name"/>
        <input type="number" name="player_limit" placeholder="Max number of player"/>
      </form>

      <div class="invited-players-list"></div>
    </div>

  `),

  events: {
    'click .back-btn': 'returnToHomePage'
  },

  initialize: function (options) {
    this.app = options.app
    this.store = this.app.store
    this.$wrapper = options.$wrapper

    this._render()
    this._renderPlayers()
  },

  _renderPlayers: function () {
    this.store.players.each ((player) => {
      if (player.get('status') === 'online') { new playerView ({ state: 'nonMember', model: player, $wrapper: this.playerList }) }
    })
  },

  returnToHomePage: function () { this.app.trigger('main-board-page') },

  _formData: function () {
    let rawData = this.$('form').serializeArray()
    return _( rawData ).reduce((accumulator, obj) => { (accumulator[obj.name] = obj.value) && accumulator }, {})
  },
  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )

    this.playerList = this.$('.players-list')
    this.invitedPlayerList = this.$('.invited-players-list')
  }
})
