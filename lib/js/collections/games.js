const Backbone = require('backbone')
const _ = require('underscore')

var { Game } = require('../models/game')

exports.Games = Backbone.Collection.extend ({

  model: Game

})