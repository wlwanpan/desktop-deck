const $ = require('jquery')
const _ = require('underscore')
const Backbone = require('backbone')
const storage = require('electron-json-storage')

var { loginView } = require('./js/views/loginView')
var { mainView } = require('./js/views/mainView')
var { createChannelView } = require('./js/views/createChannelView')
var { Store } = require('./js/models/store')
var { Account } = require('./js/models/account')

var AjaxCallback = require('./js/api/apiGen')

var AppView = Backbone.View.extend ({

  initialize: function () {
    this.$window = $('.window')
    this.$windowHeader = $('.window-header')
    this.store = new Store()
    this._loadAndValidateToken()

    this.on ('login-page', this._renderLoginPage)
    this.on ('main-board-page', this._mainBoardPage)
    this.on ('create-channel-page', this._createChannelPage)
  },

  createCurrentAccount: function (options) { this.currentAccount = new Account (options) },

  _renderLoginPage: function () { new loginView ({ app: this, $wrapper: this.$window }) },

  _mainBoardPage: function () { new mainView ({ app: this, $wrapper: this.$window, $windowHeader: this.$windowHeader }) },

  _createChannelPage: function () { new createChannelView ({ app: this, $wrapper: this.$window }) },

  _loadAndValidateToken: function () {
    storage.get('authToken', (error, data) => {
      if (error) throw error
      if ( _.has(data, 'token') ) { AjaxCallback.setToken(data.token), AjaxCallback.authToken (
        (response) => {
          if ( response.status ) {
            this.createCurrentAccount(response), this.trigger ('main-board-page')
          } else {
            this.trigger ('login-page')
          }}
        )
      } else {
        this.trigger ('login-page')
      }
    })
  }
})

var appView = new AppView()
