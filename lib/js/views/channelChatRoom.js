const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var socket = require('../api/apiSocket')

exports.channelChatRoom = Backbone.View.extend ({
  id: 'channel-chat-room',
  className: 'grid-container',

  template: _.template (`
    <h3> CHANNEL <%- id %></h3>
    <div class="chat-room-window">
      <div class="messages-list"></div>
    </div>
    <div class="input-group">
      <input class="message-input-form input-group-field" type="text">
      <div class="input-group-button">
        <input type="submit" class="button hollow" value="Submit">
      </div>
    </div>
  `),

  events: {
    'click input[type=submit]': 'sendMessage'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper

    this._render()
    this._init_listeners()
  },

  sendMessage: function (e) {
    let channelID = this.model.get('id')
    let messageToBroadcast = this.inputForm.val()
    socket.broadcastToChannel( channelID, messageToBroadcast )
  },

  _init_listeners: function () {
    this.listenTo( this.model.get('messages'), 'add', (messageModel) => {
      this.messageList.append(messageModel.toView())
    })

  },

  _render: function () {
    this.$el.html(this.template( this.model.toJSON() ))
    this.$wrapper.html( this.$el )

    this.messageList = this.$('.messages-list')
    this.inputForm = this.$('.message-input-form')
  }
})
