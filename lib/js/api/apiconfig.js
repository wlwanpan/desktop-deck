/*
  Check environment, stores URL and helper functions to route to the backend (ffa-deck)
*/
const inDevelopment = require('electron-is-dev')

let baseURL = () => inDevelopment ? 'http://localhost:5000' : 'https://mysterious-inlet-40312.herokuapp.com'

const BASE_URL = baseURL()
const ACTION_CABLE_URL = BASE_URL + '/cable'

module.exports = {

  getUrl: (url) => BASE_URL.concat(url),
  getCableUrl: (token) => `${ACTION_CABLE_URL}?token=${token}`

}