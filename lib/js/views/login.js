const Backbone = require('backbone');
const $ = require('jquery');
const _ = require('underscore');

exports.loginView = Backbone.View.extend({
  id: 'login-page',
  template: _.template(`
    <form class="row">
      <div class="medium-5 columns">
        <input type="text" placeholder="Enter Email"></input>
      </div>
      <div class="medium-5 columns">
        <input type="text" placeholder="Password"></input>
      </div>
      <a class="login-btn button hollow">Login</a>
      <a class="register-btn button hollow">Register</a>
    </form>
  `),
  events: {
    'click .login-btn': 'login'
  },
  initialize: function(options) {
    this.$wrapper = options.$wrapper;
    this.render();
  },
  login: function(e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      dataType: "json",
      url: "http://localhost:5000/users",
      dataType: "json",
      success: function() {},
      error: function () {}
    });
  },
  register: function(e) {
    e.preventDefault();
    console.log("api call to register");
  },
  render: function() {
    this.$el.html(this.template());
    this.$wrapper.append(this.$el);
  }
});
