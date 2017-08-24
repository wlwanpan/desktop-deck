const electron = require('electron');
const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone');
const ipc = electron.ipcRenderer; // talk to /lib/main.js if you need (see electron docs for ipcRenderer/ipcMain)

// const Util = require('./js/util');

const loginView = require('./js/views/login');

var MainView = Backbone.View.extend({
  template: _.template(`
    <div id="home" class="pane">
      <h1>
        <span class="icon icon-globe"></span>
        Home
      </h1>
      <div class="login-page-wrapper"></div>
    </div>
  `),

  events: {
    "click": 'navigate',
  },

  initialize: function() {
    this.render();
    this.position();
  },
  _render_login: function() {
    new loginView({
      $wrapper: this.$('.login-page-wrapper'), 
      parent: this
    });
  },
  render: function() {
    this.$el.html(this.template())
  },

  position: function() {
    $('.window-content').append(this.$el)
  },
});

var mainView = new MainView();