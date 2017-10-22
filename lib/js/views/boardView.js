/*
  Gen board wrapper
*/
const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

const { chatRoomView } = require('./chatRoomView')

const socket = require('../services/socket')

exports.boardView = Backbone.View.extend({
  id: 'main-board',
  className: 'grid-x',

  template: _.template (`
    <div class="small-8 cell">

    </div>
    <div class="chat-room-wrapper small-4 cell"></div>
  `),

  initialize: function ({ app, $wrapper, admin }) {
    this.app = app
    this.$wrapper = $wrapper
    console.log (admin ? 'as-admin' : 'as-non-admin')

    this._render()
    this._renderChatRoom()
  },

  _renderChatRoom: function () {
    new chatRoomView ({ model: this.model, $wrapper: $('.chat-room-wrapper') })
  },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )
  }

})