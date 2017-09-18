const Backbone = require('backbone')
const _ = require('underscore')

exports.Player = Backbone.Model.extend ({

  defaults: {

  },

  template: _.template (`
    <div class="expanded button hollow">
      <%- username %>
    </div>
  `),

  events: {
    'click': 'selected'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper
  },

  toView: function () {
    return this.template( this.toJSON() )
  }

})