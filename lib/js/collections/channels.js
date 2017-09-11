const Backbone = require('backbone')
const _ = require('underscore')

var { Channel } = require('../models/channel') 

exports.Channels = Backbone.Collection.extend ({

  model: Channel,

  initConnection: function (socket) {
    socket.connectToChannel((message) => {
      console.log (message)
    })
  }

})