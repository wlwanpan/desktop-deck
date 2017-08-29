const Backbone = require('backbone');
const $ = require('jquery');
const _ = require('underscore');

exports.mainBoard = Backbone.View.extend ({
  id: 'main-board',
  template: _.template(`
    <div class="row">
      <div class="medium-4 columns"'>Channel Container</div>
      <div class="medium-8 columns"'>Current Forum Container</div>
    </div>
  `),

  events: {},

  initialize: function (options) {
    this.$wrapper = options.$wrapper;
    console.log (options);
    this._render();
  },

  _render: function () {
    this.$el.html( this.template() );
    this.$wrapper.html( this.$el );
  }

});
