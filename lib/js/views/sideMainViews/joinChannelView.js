const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')


exports.joinChannelView = Backbone.View.extend ({
  id: 'join-channel-view',

  template: _.template (`

    <h1>Join Channel<h1>

  `),

  initialize: function (options) {

    this.$wrapper = options.$wrapper
    this._render()
  },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.html( this.$el )
  }

})
