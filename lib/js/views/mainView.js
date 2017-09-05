const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')
var { channelView } = require('./channelView')

exports.mainView = Backbone.View.extend ({
  id: 'main-view',
  template: _.template(`
    <div class="grid-x">
      <div class="small-12 cell"'>
        <div class="logout-btn button hollow">Logout</div>
      </div>
      <div class="channel-container small-4 cell"'></div>
      <div class="main-channel-container small-8 cell"'></div>
    </div>
  `),

  events: {
    'click .logout-btn': 'logout'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper
    this.app = options.app

    this._render()
    this._renderComponents()
  },

  logout: function () {
    AjaxCallback.logout (() => this.app.trigger('login-page'))
  },

  _renderChannelView: function () {
    new channelView ({
      app: this.app, $wrapper: this.$('.channel-container'),
      $mainWrapper: this.$('.main-channel-container')
    });
  },

  _renderComponents: function () {
    this._renderChannelView();
  },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )
  }
})