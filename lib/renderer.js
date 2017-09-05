const $ = require('jquery')
const _ = require('underscore')
const Backbone = require('backbone')
const storage = require('electron-json-storage')

var { loginView } = require('./js/views/login')
var { mainView } = require('./js/views/mainView')
var AjaxCallback = require('./js/api/apiGen')

var AppView = Backbone.View.extend ({

  initialize: function () {
    this.$window = $('.window')
    this._loadAndValidateToken()

    this.on ('login-page', this._renderLoginPage)
    this.on ('main-board-page', this._mainBoardPage)
  },

  _renderLoginPage: function () {
    this.LoginPage = new loginView ({
      app: this, $wrapper: this.$window,
    })
  },

  _mainBoardPage: function () {
    this.MainView = new mainView ({
      app: this, $wrapper: this.$window
    })
  },

  _loadAndValidateToken: function () {
    storage.get('authToken', (error, data) => {
      if (error) throw error
      // Also need to validate authentication of token then ... 
      if (_.has (data, 'token')) {
        AjaxCallback.setToken (data.token)
        this.trigger ('main-board-page')
      } else {
        this.trigger ('login-page')
      }
    })
  }
})

var appView = new AppView()
