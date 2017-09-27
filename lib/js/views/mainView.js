const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')
var socket = require('../api/apiSocket')
var { notificationView } = require('./notificationView')

exports.mainView = Backbone.View.extend ({
  id: 'main-view',
  className: 'grid-x',

  template: _.template(`
    <div class="header-wrapper small-12 cell"></div>
    <div class="main-channel-container small-12 cell">
      <div class="create-channel expanded button hollow">Create Channel</div>
      <div class="join-channel expanded button hollow">join Channel</div>
      <div class="logout-btn expanded button hollow">Logout</div>
    </div>
  `),

  events: {
    'click .logout-btn': 'logout',
    'click .create-channel': 'createChannel',
    'click .join-channel': 'joinChannel'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper
    this.$windowHeader = options.$windowHeader
    this.app = options.app
    this.store = this.app.store

    this._render()

    socket.broadcastTo({ tunnel: 'global', data: {status: 'online'} })
  },

  logout: function () {
    socket.broadcastTo({ tunnel: 'global', data: {status: 'offline'} })
    AjaxCallback.logout (() => this.app.trigger('login-page'))
  },

  createChannel: function () { this.app.trigger('create-channel-page') },

  joinChannel: function () {},

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )
  }
})
