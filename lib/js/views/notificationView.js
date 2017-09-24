const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')
var socket = require('../api/apiSocket')

exports.notificationView = Backbone.View.extend ({
  className: 'grid-x notification-view',

  template: _.template (`
    <div class="small-6 cell"><%- username %> : <%- shoutout %></div>
    <div class="accept-btn button hollow">Accept</div>
    <div class="reject-btn button hollow">Reject</div>
  `),

  events: {
    'click .accept-btn': 'accept',
    'click .reject-btn': 'reject'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper

    if (this.model.get('shoutout') == 'wanna-join') { this._render() }
  },

  accept: function (e) {
    
  },

  reject: function (e) {
    e.preventDefault()
    this.model.set('shoutout', undefined)
    this.remove()
  },

  _render: function () {
    this.$el.html (this.template ( this.model.toJSON() ))
    this.$wrapper.html ( this.$el )
  }

})