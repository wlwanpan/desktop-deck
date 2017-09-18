const Backbone = require('backbone')
const _ = require('underscore')

var { Player } = require('../models/player')

exports.Players = Backbone.Collection.extend ({

  model: Player

})