const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

exports.playerView = Backbone.View.extend ({
  className: 'player-item-view',

  template: _.template (`
    <div class="player-item-action expanded button hollow"><%- username %></div>
  `),

  events: {
    'click': 'requestGame'
  },

  constructor: function (options) {
    // this.events = _.clone( this.events )
    // this.events = _.defaults( this.events, this.expandableEvents[options.state] )

    Backbone.View.apply(this, arguments)
  },

  initialize: function (options) {
    this.$nonMemberWrapper = options.$nonMemberWrapper
    this.$memberWrapper = options.$memberWrapper

    this._render()
    this._refreshStatePosition()

    this.listenTo(this.model, 'change:state', this._refreshStatePosition)
  },

  _refreshStatePosition: function () {
    console.log (`${this.model.get('username')}: ${this.model.get('state')}`)
    switch (this.model.get('state')) {
      case 'member':
        this.$playerBtn.removeClass('secondary').addClass('success')
        break
      case 'nonMember':
        this.$playerBtn.removeClass('secondary success')
        break
      case 'invited':
        this.$playerBtn.addClass('secondary')
        break
    }
    this._position()
  },

  requestGame: function (e) {
    if (this.model.get('state') == 'nonMember') {
      this.model.sendMessage({ message: { status: 'wanna-join' }, callback: () => {
        this.model.set('state', 'invited')
      }})
    }
  },

  _position: function () {
    (this.model.get('state') === 'nonMember' ? this.$nonMemberWrapper : this.$memberWrapper).append( this.$el )
  },

  _render: function () {
    this.$el.html( this.template(this.model.toJSON()) )

    this.$playerBtn = this.$('.player-item-action')
  }
})
