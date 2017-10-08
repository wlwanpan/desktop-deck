/*
  Check environment, stores URL and helper functions to route to the backend (ffa-deck)
*/
const inDevelopment = require('electron-is-dev')
// const inDevelopment = false

const PRODUCTION_AWS = 'http://18.220.107.107:5000'
const PRODUCTION_HEROKU = 'https://mysterious-inlet-40312.herokuapp.com'

let baseURL = () => inDevelopment ? 'http://localhost:5000' : 'http://localhost:5000' //PRODUCTION_AWS

const BASE_URL = baseURL()
const ACTION_CABLE_URL = BASE_URL + '/cable'

module.exports = {

  getUrl: (url) => BASE_URL.concat(url),
  getCableUrl: (token) => `${ACTION_CABLE_URL}?token=${token}`

}