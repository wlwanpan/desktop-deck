const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')
var socket = require('../api/apiSocket')

exports.mainView = Backbone.View.extend ({
  id: 'main-view',
  className: 'grid-x',

  template: _.template(`
    <div class="main-channel-container small-12 cell"'>
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
    this.app = options.app
    this.store = this.app.store

    this._render()
  },

  logout: function () {
    socket.broadcastTo({ channel: 'status', data: {status: 'offline'} })
    AjaxCallback.logout (() => this.app.trigger('login-page'))
  },

  createChannel: function () { this.app.trigger('create-channel-page') },

  joinChannel: function () {},

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )

    socket.broadcastTo({ channel: 'status', data: {status: 'online'} })
  }
})