const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var { chatRoomView } = require('./chatRoomView')

exports.memberChannelView = Backbone.View.extend ({
  id: 'member-channel-view',
  className: 'grid-x',

  template: _.template (`
    <div class="small-8 cell">
      <div class="quit-btn button round-btn">Exit Game</div>
      <h3>Game Settings / <%- gameID %></h3>
    </div>

    <div class="chat-room-wrapper small-4 cell"></div>
  `),

  events: {
    'click .quit-btn': 'quitGame'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper
    this.app = options.app

    this._render()
    this._renderChatRoom()
  },

  quitGame: function (e) {
    this.remove()
    this.app.trigger( 'main-board-page' )
  },

  _renderChatRoom: function () {
    new chatRoomView ({ $wrapper: $('.chat-room-wrapper'), model: this.app.currentGame })
  },

  _render: function () {
    this.$el.html( this.template({ gameID: this.app.currentGame.get('id') }) )
    this.$wrapper.html( this.$el )
  }

})