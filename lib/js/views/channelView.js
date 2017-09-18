const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var socket = require('../api/apiSocket')

exports.channelView = Backbone.View.extend ({
  id: 'channel-view',
  className: 'grid-x',

  template: _.template(`
    <div class="back-btn expanded button hollow">Back</div>
    <div class="players-window small-6 small-offset-3 cell">
      <div class="players-list"></div>
    </div>
  `),

  events: {
    'click .back-btn': 'returnHomePage'
  },

  initialize: function (options) {
    this.app = options.app
    this.store = this.app.store
    this.$wrapper = options.$wrapper


    this._initListeners()
    this._render()
    this._renderPlayers()
  },

  _initListeners: function () {
    this.listenTo(this, 'player-selected', this._selectPlayer)
  },

  _selectPlayer: function (player) {
    console.log(player)  
  },

  _renderPlayers: function () {
    this.store.players.each ((player) => this.playerList.append( player.toView() ))
  },

  returnHomePage: function () { this.app.trigger('main-board-page') },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )

    this.playerList = this.$('.players-list')
  }
})
