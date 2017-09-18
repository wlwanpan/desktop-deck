/*
  Attempt to use IPFS protocol for p2p chatroom
*/

const IPFS = require('ipfs')
// const ROOM = require('ipfs-pubsub-room')

const ipfs = new IPFS ()

ipfs.once ('ready', () => ipfs.id( (error, info) => {
  if (error) { throw error }
  console.log (info.id)
}))

// const room = ROOM(ipfs, 'name-of-the-room')

// room.on('peer joined', (peer) => console.log('peer: ', + peer + 'joined'))