const Gun = require('gun')
const http = require('http')

const server = http.createServer().listen(8765)
const gun = Gun({
  axe: false,
  multicast: false,
  web: server
})

module.exports = gun
