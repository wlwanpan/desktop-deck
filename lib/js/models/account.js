const Backbone = require('backbone')
const _ = require('underscore')

var AjaxCallback = require('../api/apiGen')

exports.Account = Backbone.Model.extend ({

  constructor: function (options) {

    if (options.token) {
      AjaxCallback.storeToken(options.token)
      AjaxCallback.setToken (options.token)
    }
    Backbone.Model.apply(this, arguments)
  }

})