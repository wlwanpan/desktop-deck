const $ = require('jquery')
const storage = require('electron-json-storage')
const BASE_URL = 'http://localhost:5000'

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

  storeToken: function (token) {
    storage.set('authToken', {token: token}, (error) => {
      if (error) throw error
    })
  },

  setToken: function (token) {
    $.ajaxSetup ({ beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', `Token token=${token}`)} })
  },

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