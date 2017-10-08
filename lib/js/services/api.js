/*
  Administrative ajax calls to authenticate, set and store registered token
*/
const $ = require('jquery')
const storage = require('electron-json-storage')
const config = require('./config')

var simpleAjax = (type, url) => $.ajax ({ type, url: config.getUrl(url),
  error: (error) => { console.log (error) }
})

module.exports = {

  // Game Calls
  updateGame: function (gameID, data) {
    return $.ajax ({
      type: 'PATCH',
      data: { gameData: data },
      url: config.getUrl(`/account/games/${gameID}`),
      error: (error) => { alert (error) }
    })
  },

  getGame: function (gameID) {
    return simpleAjax('GET', `/account/games/${gameID}`)
  },

  createGame: function () {
    return simpleAjax('POST', `/account/games`)
  },

  deleteGame: function (gameID) {
    return simpleAjax('DELETE', `/account/games/${gameID}`)
  },

  // Authentication Calls
  storeToken: function (token) {
    storage.set('authToken', {token: token}, (error) => {
      if (error) throw error
    })
  },
  setToken: function (token) {
    $.ajaxSetup ({ beforeSend: (xhr) => xhr.setRequestHeader('Authorization', `Token token=${token}`) })
  },
  setAuthToken: (token) => {
    storage.set('authToken', {token: token}, (error) => {
      if (error) throw error
      self.setToken(token)
    })
  },

  // Administrative Calls
  authToken: function (callback) {
    $.ajax({
      type: 'GET',
      url: config.getUrl("/account"),
      error: (error) => { alert (error) },
      success: (response) => callback (response)
    })
  },
  login: function (data, callback) {
    $.ajax({
      type: 'POST',
      data: { login: data },
      url: config.getUrl("/account/login"),
      error: (error) => { alert (error) },
      success: (response) => callback (response)
    })
  },
  logout: function (callback) {
    storage.remove ('authToken', (error) => { if (error) throw error })
    $.ajax({
      type: 'POST',
      url: config.getUrl('/account/logout'),
      success: (response) => callback (response)
    })
  },
  register: function (data, callback) {
    $.ajax({
      type: 'POST',
      data: { register: data },
      url: config.getUrl('/account/register'),
      error: (error) => { alert (error) },
      success: (response) => callback (response)
    })
  },
}
