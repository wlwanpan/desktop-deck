const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var socket = require('../services/socket')

exports.chatRoomView = Backbone.View.extend ({
  id: 'chat-room-view',

  template: _.template (`
    <h3>Chat Room</h3>
    <div class="message-list"></div>

    <form>
      <input name="message-holder" type="text" placeholder="Type a message ..."/>
      <input type="submit" style="display:none"/>
    </form>
  `),

  messageTemplate: _.template (`
    <div class="message-item">
      <span><%- username %></span>: <span><%- message %></span>
    </div>
  `),

  events: {
    'submit': 'sendMessage'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper

    this._render()
    this._initListeners()
  },

  _initListeners: function () {
    this.listenTo(this.model.players, 'add', this._playerJoined)
    this.listenTo(this.model.players, 'remove', this._playerLeft)

    socket.subscribeTo({ tunnel: this.model.get('channelID'), callback: (response) => {
        var { from, data: { username, message } }  = response
        this._renderMessage(username, message)
      }
    })
  },

  _renderMessage: function (username, message) {
    this.messageList.append( this.messageTemplate({username, message}) )
  },

  _playerJoined: function (player) {
    this._renderMessage(player.get('username'), "joined")
  },

  _playerLeft: function (player) {
    this._renderMessage(player.get('username'), "left")
  },

  sendMessage: function (e) {
    e.preventDefault()
    if (this.inputMessage.val().length > 0) {
      socket.broadcastTo({ to: this.model.get('id'), data: { message: this.inputMessage.val()} })
      this.inputMessage.val('')
    }
  },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )

    this.messageList = this.$('.message-list')
    this.inputMessage = this.$('input')
  }

})