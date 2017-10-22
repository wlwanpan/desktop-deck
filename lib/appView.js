/*
  Main Application View, also acts as a pseudo router =>
    listens to trigger events to change window view && manage window header notification view
*/
const $ = require('jquery')
const _ = require('underscore')
const Backbone = require('backbone')
const storage = require('electron-json-storage')

var { loginView } = require('./js/views/loginView')
var { mainView } = require('./js/views/mainView')
var { createGameView } = require('./js/views/createGameView')
var { notificationView } = require('./js/views/notificationView')
var { memberLobbyView } = require('./js/views/memberLobbyView')

var { Account } = require('./js/models/account')
var { Games } = require('./js/collections/games')
var { Players } = require('./js/collections/players')

var API = require('./js/services/api')

var AppView = Backbone.View.extend ({

  initialize: function () {
    this.$window = $('.window')
    this.$windowHeader = $('.window-header')
    this.games = new Games()
    this.players = new Players()
    this.currentGame = undefined
    this._loadAndValidateToken()

    this.on ({
      'login-page'         : this._renderLoginPage,
      'main-board-page'    : this._mainBoardPage,
      'create-game-page'   : this._createGamePage,
      'member-channel-page': this._memberChannelPage
    })
  },

  createCurrentAccount: function (options) {
    this.currentAccount = new Account ( _.extend( options, { app: this }) )
  },

  renderNotification: function (options) {
    new notificationView (
      _.extend( options, { $wrapper: this.$windowHeader } )
    )
  },

  renderAlert: function (error) {
    console.log(error) // To implement an alert dialog
  },

  _renderLoginPage: function () { new loginView ({ app: this, $wrapper: this.$window }) },

  _mainBoardPage: function () { new mainView ({ app: this, $wrapper: this.$window }) },

  _createGamePage: function () { new createGameView ({ app: this, $wrapper: this.$window }) },

  _memberChannelPage: function () {
    if ( this.currentGame ) {
      new memberLobbyView ({ app: this, $wrapper: this.$window })
    }
    else {
      this.renderAlert('No ongoing game')
    }
  },

  _loadAndValidateToken: function () {
    storage.get('authToken', (error, data) => {
      if (error) throw error
      if ( _.has(data, 'token') ) { API.setToken(data.token), API.authToken (
        (response) => {
          if ( response.status ) {
            this.createCurrentAccount(response)
            this.trigger ('main-board-page')
          }
          else {
            this.trigger ('login-page')
          }}
        )
      }
      else {
        this.trigger ('login-page')
      }
    })
  }
})

var appView = new AppView()
