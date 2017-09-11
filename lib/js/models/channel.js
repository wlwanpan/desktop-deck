const Backbone = require('backbone')
const _ = require('underscore')

var { Messages } = require('../collections/messages') 

exports.Channel = Backbone.Model.extend ({

  defaults: {
    messages: new Messages
  }

})