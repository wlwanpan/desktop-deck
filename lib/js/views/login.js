const Backbone = require('backbone');
const _ = require('underscore');

var loginView = Backbone.View.extend({
  id: 'login-page',
  template: _.template(`
    <form>
      <div class="row">
        <div class="medium-5 columns">
          <input type="text" placeholder="Enter Email"></input>
        </div>
        <div class="medium-5 columns">
          <input type="text" placeholder="Password"></input>
        </div>
      </div>
    </form>
  `),
  events: {

  },
  initialize: function(options) {
    console.log("initiated");
    console.log(options);
    this.$wrapper = options.$wrapper;
    this.render();
  },
  render: function() {
    this.$el.html(this.template());
    // this.$wrapper.append(this.$el);
  }
});

export default loginView;