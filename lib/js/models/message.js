const Backbone = require('backbone')
const _ = require('underscore')

exports.Message = Backbone.Model.extend ({
  
  defaults: {
    from: 'unknown',
    body: 'body of message'
  },

  template: _.template (`
    <div class="message-wrapper">
      <span class="message-from"><%- from %></span>: <span class="message-body"><%- message %></span>
    </div>
  `),

  toView: function () {
    return this.template( this.toJSON() )
  }

})