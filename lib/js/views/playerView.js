const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

exports.playerView = Backbone.View.extend ({
  className: 'player-item-view',

  template: _.template (`
    <div class="player-item-action button round-btn"><%- username %></div>
  `),

  events: {
    'click': 'requestGame'
  },

  initialize: function (options) {
    this.$nonMemberWrapper = options.$nonMemberWrapper
    this.$memberWrapper = options.$memberWrapper
    this.app = options.app

    this._render()
    this._refreshStatePosition()

    this.listenTo(this.model, 'change:state', this._refreshStatePosition)
  },

  _refreshStatePosition: function () {
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
      case 'offline':
        this.remove()
        break
    }
    this._position()
  },

  requestGame: function (e) {
    if ( this.model.get('state') === 'nonMember' ) {
      this.app.currentGame.registerPlayerToChannel({ playerID: this.model.get('id'), callback: () => {
          this.model.sendInviteToGame({ gameID: this.app.currentGame.get('id') })
        }
      })
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
