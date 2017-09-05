const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var { channelChatRoom } = require('./channelChatRoom')

exports.channelItemView = Backbone.View.extend ({
  tagName: 'li',

  template: _.template(`
    <div class="expanded button hollow"><%- id %></div>
  `),

  events: {
    'click': 'loadChannel'
  },

  initialize: function (options) {
    this.$channelList = options.$channelList
    this.$mainWrapper = options.$mainWrapper

    this._render()
  },

  loadChannel: function () {
    new channelChatRoom ({
      $wrapper: this.$mainWrapper, model: this.model
    })
  },

  _render: function () {
    this.$el.html(this.template( this.model.toJSON() ))
    this.$channelList.append( this.$el )
  }
})
