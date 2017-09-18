/*
  Socket to talk to redis/ActionCable websocket from backend/redis server
  Deals with channel ajax calls and socket connection
*/

const $ = require('jquery')
const config = require('./apiconfig')
const storage = require('electron-json-storage')

const ActionCable = require('actioncable')

var getAuthToken = () => {
  return new Promise ( function (resolve, reject) {
    storage.get ( 'authToken', (error, data) => {
      if (error) throw error
      if (data.token) resolve(data.token)
    })
  })
}
// Links channel name to corresponding backend channel
var socketNamespace = {
  status: 'StatusChannel',
  message: 'MessagesChannel'
}
var channelNamespace = {
  status: 'global-status-channel',
  message: 'global-message-channel'
}

module.exports = {

  broadcastTo: function (options) {
    var { channel, data } = options
    $.ajax ({
      type: 'POST',
      url: config.getUrl(`/broadcast`),
      data: { data, channel: channelNamespace[channel] }
    })    
  },
  subscribeTo: function (channelName, callback) {
    getAuthToken().then( (token) => {
      let cable = ActionCable.createConsumer( config.getCableUrl(token) )
      cable.subscriptions.create (socketNamespace[channelName], { received: callback })
    })
  }
}