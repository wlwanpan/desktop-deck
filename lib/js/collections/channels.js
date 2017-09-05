const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var { Channel } = require('../models/channel') 

exports.Channels = Backbone.Collection.extend ({
  model: Channel
})