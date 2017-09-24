const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

exports.playerView = Backbone.View.extend ({
  className: 'player-selection-view',

  template: _.template (`
    <div class="expanded button hollow"><%- username %></div>
  `),

  events: {
    'click': 'selected'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper

    this._render()
  },

  selected: function (e) {
    e.preventDefault()
    this.model.requestGame()
    this.remove()
  },  

  _render: function () {
    this.$el.html( this.template(this.model.toJSON()) )
    this.$wrapper.append( this.$el )
  }  
})
