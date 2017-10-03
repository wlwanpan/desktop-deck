const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')


exports.aboutView = Backbone.View.extend ({
  id: 'about-view',

  template: _.template (`

    <h1>About Page<h1>

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
