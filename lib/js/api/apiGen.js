const $ = require('jquery')
const storage = require('electron-json-storage')
const ActionCable = require('action-cable')

const BASE_URL = 'http://localhost:5000'
const ACTION_CABLE_URL = 'ws://localhost:5000/cable'

var getUrl = (url) => BASE_URL.concat(url)

var setAuthToken = (token) => {
  storage.set('authToken', {token: token}, (error) => {
    if (error) throw error
    $.ajaxSetup ({ beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', `Token token=${token}`)} })
  })
}

var { Channels } = require('../collections/channels')
var { Channel } = require('../models/channel')

module.exports = {

  // Action Cable
  getCable: function () {
    // connection.subscribe({next: data => {
    //   console.log('got:', data);
    // }});
    return ActionCable.createConsumer(ACTION_CABLE_URL)
  },

  // Channel Model/Collection fetch
  createChannel: function (data, callback) {
    $.ajax({
      type: 'POST',
      url: getUrl(`/channels`),
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
      url: getUrl(`/channels`),
      error: (error) => { alert (error) },
      success: (response) => {
        callback ( new Channels (response.channels) )
      }
    })
  },

  // Authentication
  storeToken: function (token) {
    storage.set('authToken', {token: token}, (error) => {
      if (error) throw error
    })
  },
  setToken: function (token) {
    $.ajaxSetup ({ beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', `Token token=${token}`)} })
  },

  // Administrative
  login: function (data, callback) {
    $.ajax({
      type: 'POST',
      data: { login: data },
      url: getUrl("/accounts/login"),
      error: (error) => { alert (error) },
      success: (response) => callback (response)
    })
  },
  logout: function (callback) {
    storage.remove ('authToken', (error) => { if (error) throw error })
    $.ajax({
      type: 'POST',
      url: getUrl('/accounts/logout'),
      success: (response) => callback (response)
    })
  }, 
  register: function (data, callback) {
    $.ajax({
      type: 'POST',
      data: { register: data },
      url: getUrl('/accounts/register'),
      error: (error) => { alert (error) },
      success: (response) => callback (response)
    })
  },
}