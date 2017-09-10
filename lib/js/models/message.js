const Backbone = require('backbone')
const _ = require('underscore')

exports.Message = Backbone.Model.extend ({
  defaults: {
    from: 'unknown',
    body: 'body of message'
  },

  template: _.template (`
    <div class="message-from"><%- from %></div>
    <div class="message-body"><%- message %></div>
  `),

  toView: function () {
    return this.template( this.toJSON() )
  }

})