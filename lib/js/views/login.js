const Backbone = require('backbone');
const $ = require('jquery');
const _ = require('underscore');

var { mainBoard } = require('./mainBoard.js');

exports.loginView = Backbone.View.extend ({
  id: 'login-page',
  template: _.template(`
    <form class="row">
      <div class="medium-5 columns">
        <input type="text" name="username" placeholder="Username"></input>
      </div>
      <div class="medium-5 columns">
        <input type="password" name="password" placeholder="Password"></input>
      </div>
      <div class="medium-5 columns">
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
    this.$wrapper = options.$wrapper;
    this.render();
  },

  login: function (e) {
    e.preventDefault();
    $.ajax({    
      type: 'POST',
      data: {login: this._formData()},
      url: "http://localhost:5000/accounts/login",
      error: (error) => {
        console.log(error);
      },
      success: (response) => {
        if (response.exist) {
          this.MainBoard = new mainBoard ({
            $wrapper: this.$wrapper
          });
        } else {
          alert ("WRONG PASSWORD");
        }
      }
    });
  },

  register: function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      data: {register: this._formData()},
      url: "http://localhost:5000/accounts/register",
      error: function () {},
      success: function (response) {
        console.log(response);
      }
    });
  },

  _formData: function () {
    var rawData = this.$('form').serializeArray();
    return _( rawData ).reduce ( (accumulator, obj) => {
      accumulator[obj.name] = obj.value;
      return accumulator;
    }, {});
  },

  render: function () {
    this.$el.html(this.template());
    this.$wrapper.html(this.$el);
  }
});
