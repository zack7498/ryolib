
'use strict'

const genericPool = require('generic-pool')

class ConnectionPool {
  constructor () {
    if (this.constructor === ConnectionPool) {
      throw new TypeError(`Abstract classes can't be instantiated.`)
    }
  }
  /*
 ██ ███    ██ ██ ████████
 ██ ████   ██ ██    ██
 ██ ██ ██  ██ ██    ██
 ██ ██  ██ ██ ██    ██
 ██ ██   ████ ██    ██
*/
  /**
   * 
   * @param {Object} config 
   */
  init (config) {
    let self = this
    self.pool = genericPool.createPool({
      'create': function () {
        let cClinet = self._getClinet(config)
        return cClinet
      },
      'destroy': function (client) {
        self._disconnect(client)
      }
    }, {
      'max': config.max || 10,
      'min': config.min || 10
    })
  }
  /*
 ██████  ███████ ██      ███████  █████  ███████ ███████
 ██   ██ ██      ██      ██      ██   ██ ██      ██
 ██████  █████   ██      █████   ███████ ███████ █████
 ██   ██ ██      ██      ██      ██   ██      ██ ██
 ██   ██ ███████ ███████ ███████ ██   ██ ███████ ███████
*/
  /**
   * 
   * @param {Object} connectionObj 
   */
  release (connectionObj) {
    this.pool.release(connectionObj)
  }
  /*
  ██████  ███████ ████████
 ██       ██         ██
 ██   ███ █████      ██
 ██    ██ ██         ██
  ██████  ███████    ██
*/
  /*
  ██████  ██████  ███    ██ ███    ██ ███████  ██████ ████████ ██  ██████  ███    ██
 ██      ██    ██ ████   ██ ████   ██ ██      ██         ██    ██ ██    ██ ████   ██
 ██      ██    ██ ██ ██  ██ ██ ██  ██ █████   ██         ██    ██ ██    ██ ██ ██  ██
 ██      ██    ██ ██  ██ ██ ██  ██ ██ ██      ██         ██    ██ ██    ██ ██  ██ ██
  ██████  ██████  ██   ████ ██   ████ ███████  ██████    ██    ██  ██████  ██   ████
*/
  /**
   * 
   * @param {Number} priorit 
   */
  async getConnection (priorit = 0) {
    try {
      let cConnection = await this.pool.acquire(priorit)
      return cConnection
    } catch (error) {
      throw new Error(`Can't not get Connection！`)
    }
  }

  /*
          ██████  ███████ ████████  ██████ ██      ██ ███    ██ ███████ ████████
         ██       ██         ██    ██      ██      ██ ████   ██ ██         ██
         ██   ███ █████      ██    ██      ██      ██ ██ ██  ██ █████      ██
         ██    ██ ██         ██    ██      ██      ██ ██  ██ ██ ██         ██
 ███████  ██████  ███████    ██     ██████ ███████ ██ ██   ████ ███████    ██
*/
  _getClinet () {
    throw new TypeError(`Method '_getClinet()' must be implemented.`)
  }
  /*
         ██████  ██ ███████  ██████  ██████  ███    ██ ███    ██ ███████  ██████ ████████
         ██   ██ ██ ██      ██      ██    ██ ████   ██ ████   ██ ██      ██         ██
         ██   ██ ██ ███████ ██      ██    ██ ██ ██  ██ ██ ██  ██ █████   ██         ██
         ██   ██ ██      ██ ██      ██    ██ ██  ██ ██ ██  ██ ██ ██      ██         ██
 ███████ ██████  ██ ███████  ██████  ██████  ██   ████ ██   ████ ███████  ██████    ██
*/
  _disconnect () {
    throw new TypeError(`Method '_disconnect()' must be implemented.`)
  }
}
module.exports = ConnectionPool
