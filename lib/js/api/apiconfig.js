/*
  Stores URL and helper functions to route to the backend (ffa-deck)
*/

const BASE_URL = 'http://localhost:5000'
const ACTION_CABLE_URL = 'ws://localhost:5000/cable'
const ACTION_CABLE_PRODUCTION_URL = 'https://mysterious-inlet-40312.herokuapp.com/'

module.exports = {

  getUrl: (url) => BASE_URL.concat(url),

  getCableUrl: (token) => {
    return `${ACTION_CABLE_URL}?token=${token}`
  }

}