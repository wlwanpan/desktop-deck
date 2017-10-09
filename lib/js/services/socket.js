/*
  Socket to talk to redis/ActionCable websocket from backend/redis server
  Deals with channel ajax calls and socket connection
*/
const $ = require('jquery')
const config = require('./config')
const storage = require('electron-json-storage')
const ActionCable = require('actioncable')

var getAuthToken = () => new Promise ((resolve, reject) => {
  storage.get ( 'authToken', (error, data) => {
    if (error) throw error
    if (data.token) resolve(data.token)
  })
})

module.exports = {

  broadcastToGame: function ({ gameID, data }) {
    $.ajax ({
      type: 'POST',
      data: {data},
      url: config.getUrl(`/account/games/${gameID}/broadcast`),
    })
  },

  broadcastTo: function ({ to, data, callback }) {
    $.ajax ({
      type: 'POST',
      url: config.getUrl(`/broadcast`),
      data: { to, data },
      success: (response) => { if (callback instanceof Function) { callback (response) }}
    })
  },

  subscribeTo: function ({ token, to, callback }) {
    var subscribeFunc = (validToken) => {
      let cable = ActionCable.createConsumer( config.getCableUrl(validToken) )
      cable.subscriptions.create ({ channel: "ConnectorChannel", to }, { received: callback })
    }
    token ? subscribeFunc(token) : getAuthToken().then( (storedToken) => subscribeFunc(storedToken) )
  }
}