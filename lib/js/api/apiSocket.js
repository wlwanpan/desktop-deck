/*
  Socket to talk to redis/ActionCable websocket from backend/redis server
  Deals with channel ajax calls and socket connection
*/
const $ = require('jquery')
const config = require('./apiconfig')
const storage = require('electron-json-storage')
const ActionCable = require('actioncable')

var getAuthToken = () => new Promise ((resolve, reject) => {
  storage.get ( 'authToken', (error, data) => {
    if (error) throw error
    if (data.token) resolve(data.token)
  })
})

module.exports = {

  broadcastTo: function (options) {
    console.log('broadcasted')
    var { tunnel, data, callback } = options
    $.ajax ({
      type: 'POST',
      url: config.getUrl(`/broadcast`),
      data: { tunnel, data },
      success: (response) => { if (callback instanceof Function) { callback (response) }}
    })
  },

  subscribeTo: function (options) {
    var { token, tunnel, callback } = options
    var subscribeFunc = (validToken) => {
      let cable = ActionCable.createConsumer( config.getCableUrl(validToken) )
      cable.subscriptions.create ({ channel: "ConnectorChannel", tunnel: tunnel }, { received: callback })
    }
    token ? subscribeFunc(token) : getAuthToken().then( (storedToken) => subscribeFunc(storedToken) )
  }
}