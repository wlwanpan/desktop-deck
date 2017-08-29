const electron = require('electron');
const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone');
const ipc = electron.ipcRenderer; // talk to /lib/main.js if you need (see electron docs for ipcRenderer/ipcMain)

// const Util = require('./js/util');

var { loginView } = require('./js/views/login');

var MainView = Backbone.View.extend({
  id: "home",
  template: _.template(`
    <h1><span class="icon icon-globe"></span>Home</h1>
    <div class="login-page-wrapper"></div>
  `),

  events: {
    "click": 'navigate',
  },

  initialize: function () {
    this.render();
    this.position();
    this._render_login();
  },

  _render_login: function () {
    var loginPage = new loginView ({
      $wrapper: this.$('.login-page-wrapper'), 
    });
  },

  render: function () {
    this.$el.html(this.template())
  },

  position: function () {
    $('.window').append(this.$el)
  }
});

var mainView = new MainView();
