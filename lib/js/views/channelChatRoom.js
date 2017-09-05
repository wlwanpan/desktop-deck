const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

exports.channelChatRoom = Backbone.View.extend ({
  id: 'channel-chat-room',

  template: _.template (`
    <h3>CHAT ROOM / CHANNEL <%- id %></h3>
    <div class="chat-room-messages">
    </div>
    <div class="input-group">
      <input class="input-group-field" type="text">
      <div class="input-group-button"><input type="submit" class="button hollow" value="Submit"></div>
    </div>
  `),

  initialize: function (options) {
    this.$wrapper = options.$wrapper

    this._render()
  },

  _render: function () {
    this.$el.html(this.template( this.model.toJSON() ))
    this.$wrapper.html( this.$el )

    this.messageList = this.$('.chat-room-messages')
  }
})
