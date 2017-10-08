const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var API = require('../services/api')

exports.loginView = Backbone.View.extend ({
  id: 'login-view',
  className: 'grid-x vertical-center-contents',

  template: _.template (`
    <form class="login-form small-6 small-offset-3 cell">
      <div class="login-field">
        <input class="input-field" type="text" name="username" placeholder="Username"/>
        <input class="input-field" type="password" name="password" placeholder="Password" autocomplete="off"/>
      </div>
      <div class="action-btns">
        <a class="login-btn button expanded round-btn">Login</a>
        <a class="register-btn button expanded round-btn">Register</a>
      </div>
    </form>
  `),

  events: {
    'click .login-btn': 'login',
    'click .register-btn': 'register'
  },

  initialize: function (options) {
    // <input class="input-field register-field" type="password" name="confirm_password" placeholder="Confirm Password" autocomplete="off"/>
    this.$wrapper = options.$wrapper
    this.app = options.app

    this.render()
  },

  login: function (e) {
    e.preventDefault()
    API.login ( this._formData(), (response) => {
      if (response.status) {
        this.app.createCurrentAccount (response)
        this.app.trigger('main-board-page')
      }
      else {
        this.$passwordField.val('')
        alert(response.message)
      }
    })
  },

  register: function (e) {
    e.preventDefault()
    API.register ( this._formData(), (response) => {
      if (response.status) {
        alert("Successfully Registered")
        this._clearField()
      }
      else {
        this.app.renderAlert(response)
        this._clearField()
      }
    })
  },

  _clearField: function () {
    this.$usernameField.val('')
    this.$passwordField.val('')
  },

  _formData: function () {
    return _( this.$('form').serializeArray() ).reduce (
      (accumulator, obj) => { return ((accumulator[obj.name] = obj.value) && accumulator) }, {}
    )
  },

  render: function () {
    this.$el.html(this.template())
    this.$wrapper.html(this.$el)

    this.$usernameField = this.$('input[name=username]')
    this.$passwordField = this.$('input[name=password]')
  }
})
