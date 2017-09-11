/*
  Socket to talk to redis/ActionCable websocket from backend/redis server
  Deals with channel ajax calls and socket connection
*/

const $ = require('jquery')
const config = require('./apiconfig')
const storage = require('electron-json-storage')

const ActionCable = require('actioncable')

var { Channels } = require('../collections/channels')
var { Channel } = require('../models/channel')

module.exports = {

  broadcastToChannel: function (channelID, uuid, message) {
    $.ajax ({
      type: 'POST',
      url: config.getUrl(`/channels/${channelID}/broadcast`),
      data: { message, uuid }
    })
  },

  connectToChannel: function (callback) {

    new Promise ( function (resolve, reject) {
      storage.get ( 'authToken', (error, data) => {
        if (error) throw error
        if (data.token) resolve(data.token)
      })
    }).then( (token) => {
      let cable = ActionCable.createConsumer( config.getCableUrl(token) )
      cable.subscriptions.create('MessagesChannel', { received: callback })
    })
  },

  // Channel Model/Collection fetch
  createChannel: function (data, callback) {
    $.ajax({
      type: 'POST',
      url: config.getUrl(`/channels`),
      data: { channel: data },
      error: (error) => { alert (error) },
      success: (response) => {
        callback ( new Channel (response.channel) )
      }
    })
  },
  getChannels: function (callback) {
    $.ajax({
      type: 'GET',
      url: config.getUrl(`/channels`),
      error: (error) => { alert (error) },
      success: (response) => {
        callback ( new Channels (response.channels) )
      }
    })
  }

}