const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')
/*
  Empty notification View: rendered in the window header.
  options { description[text], accept[callback], reject[callback] }
*/
exports.notificationView = Backbone.View.extend ({
  className: 'grid-x notification-view',

  template: _.template (`
    <div class="small-6 cell"><%- description %></div>
    <div class="action-btn button hollow" value="accept">Accept</div>
    <div class="action-btn button hollow" value="reject">Reject</div>
  `),

  events: {
    'click .action-btn': 'actionTrigger',
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper
    this.description = options.description
    this.accept = options.accept
    this.reject = options.reject

    this._render()
  },

  actionTrigger: function (e) {
    e.preventDefault()
    $(e.currentTarget).attr('value') === 'accept' ? this.accept() : this.reject()
    this.remove()
  },

  _render: function () {
    this.$el.html ( this.template({ description: this.description }) )
    this.$wrapper.html ( this.$el )
  }

})