const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var API = require('../services/api')
var socket = require('../services/socket')

var { aboutView } = require('./sideMainViews/aboutView')
var { joinChannelView } = require('./sideMainViews/joinChannelView')
var { loadChannelView } = require('./sideMainViews/loadChannelView')

exports.mainView = Backbone.View.extend ({
  id: 'main-view',
  className: 'grid-x',

  template: _.template (`
    <div class="header-wrapper small-12 cell"></div>
    <div class="main-btn-container vertical-center-contents small-3 cell">
      <div class="create-channel button round-btn">Create Game</div>
      <div class="join-channel button round-btn">Join Game</div>
      <div class="load-channel button round-btn">Load Game</div>
      <div class="logout-btn button round-btn">Logout</div>
    </div>
    <div class="side-container small-9 cell"></div>
  `),

  events: {
    'click .logout-btn'    : 'logout',
    'click .create-channel': 'createChannel',
    'click .join-channel'  : 'renderJoinChannel',
    'click .load-channel'  : 'renderLoadChannel'
  },

  initialize: function ({ $wrapper, app }) {
    this.$wrapper = $wrapper
    this.app = app

    this._render()
    this.renderAboutPage()
  },

  logout: function () {
    socket.broadcastTo({ tunnel: 'global', data: {status: 'offline'} })
    API.logout (() => this.app.trigger('login-page') )
  },

  createChannel: function () {
    this.app.trigger('create-game-page')
  },

  renderAboutPage: function () {
    if (this.currentView) { this.currentView.remove() }
    this.currentView = new aboutView ({ $wrapper: this.$sideWrapper })
  },

  renderJoinChannel: function () {
    if (this.currentView) { this.currentView.remove() }
    this.currentView = new joinChannelView ({ $wrapper: this.$sideWrapper })
  },

  renderLoadChannel: function () {
    if (this.currentView) { this.currentView.remove() }
    this.currentView = new loadChannelView ({ $wrapper: this.$sideWrapper })
  },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )

    this.$sideWrapper = $('.side-container')
  }
})
