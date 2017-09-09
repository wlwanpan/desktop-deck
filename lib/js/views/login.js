const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')

exports.loginView = Backbone.View.extend ({
  id: 'login-page',

  template: _.template (`
    <form class="grid-x">
      <div class="login-field small-6 small-offset-3 cell">
        <input type="text" name="username" placeholder="Username"/>
        <input type="password" name="password" placeholder="Password" autocomplete="off"/>
      </div>
      <div class="action-btns small-6 small-offset-3 cell">
        <a class="login-btn button expanded hollow">Login</a>
        <a class="register-btn button expanded hollow">Register</a>
      </div>
    </form>
  `),

  events: {
    'click .login-btn': 'login',
    'click .register-btn': 'register'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper
    this.app = options.app

    this.render()
  },

  login: function (e) {
    e.preventDefault() 
    AjaxCallback.login ( this._formData(), (response) => {
      if (response.status) {
        AjaxCallback.storeToken (response.token)
        AjaxCallback.setToken (response.token)
        this.app.trigger('main-board-page')
      } else {
        this.$passwordField.val('')
        alert(response.message)
      }
    })
  },

  register: function (e) {
    e.preventDefault()
    AjaxCallback.register ( this._formData(), (response) => {
      if (response.status) {
        this.$usernameField.val('')
        this.$passwordField.val('')
      }
    })
  },

  _formData: function () {
    var rawData = this.$('form').serializeArray()
    return _( rawData ).reduce ( (accumulator, obj) => {
      accumulator[obj.name] = obj.value
      return accumulator
    }, {})
  },

  render: function () {
    this.$el.html(this.template())
    this.$wrapper.html(this.$el)

    this.$usernameField = this.$('input[name=username]')
    this.$passwordField = this.$('input[type=password]')
  }
})
