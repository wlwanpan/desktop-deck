const Backbone = require('backbone')
const $ = require('jquery')
const _ = require('underscore')

var uuid = require('uuid-random')
var { channelItemView } = require('./channelItemView')

var socket = require('../api/apiSocket')

exports.channelView = Backbone.View.extend ({
  id: 'channel-main-view',

  template: _.template (`
    <div class="my-channel-wrapper">
      <h3>My Channels</h3>
      <div class="create-new-channel expanded button hollow">Create Channel</div>
      <ul class="channel-list"></ul>
    </div>
    <div>place list of channels here</div>
  `),

  events: {
    'click .create-new-channel': 'createNewChannel'
  },

  initialize: function (options) {
    this.$wrapper = options.$wrapper
    this.$mainWrapper = options.$mainWrapper
    this.app = options.app

    this._render()
    this._renderChannels()
  },

  createNewChannel: function (e) {
    socket.createChannel ({ uuid: uuid() }, (channelJson) => {
      this.channelCollection.add (channelJson)
    })
  },

  _renderChannel: function (channelModel) {
    new channelItemView({
      $mainWrapper: this.$mainWrapper, $channelList: this.$channelList, model: channelModel
    })
  },

  _renderChannels: function () {
    socket.getChannels ((collection) => {
      this.channelCollection = collection
      this.channelCollection.initConnection(socket)

      this.listenTo( this.channelCollection, 'add', this._renderChannel )

      this.channelCollection.each ((channelModel) => this._renderChannel (channelModel))
    })
  },

  _render: function () {
    this.$el.html( this.template() )
    this.$wrapper.append( this.$el )

    this.$channelList = this.$('.channel-list')
  }
})