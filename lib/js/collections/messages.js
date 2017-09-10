const Backbone = require('backbone')
const _ = require('underscore')

var { Message } = require('../models/message') 

exports.Messages = Backbone.Collection.extend ({
  model: Message
})