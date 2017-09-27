const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

exports.playerView = Backbone.View.extend ({
  className: 'player-item-view',

  template: _.template (`
    <div class="expanded button hollow"><%- username %></div>
  `),

  expandableEvents: {
    member: {
      'click': 'directMessage'
    },
    nonMember: {
      'click': 'requestGame'
    }
  },

  events: {
  },

  constructor: function (options) {
    this.events = _.clone( this.events )
    this.events = _.defaults( this.events, this.expandableEvents[options.state] )

    Backbone.View.apply(this, arguments)
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper

    this._render()
  },

  requestGame: function (e) {
    this.model.sendMessage({ message: { status: 'wanna-join' }, callback: () => {
      this.model.set('shoutout', 'invited')
      this.remove()
    }})
  },

  directMessage: function (e) {
    console.log("member player direct message selected")
  },

  _render: function () {
    this.$el.html( this.template(this.model.toJSON()) )
    this.$wrapper.append( this.$el )
  }  
})
