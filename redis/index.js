
'use strict'

const ConnectionPool = require('../connectionPool/index.js')
const {promisify} = require('util');
const redis = require('redis')

class Redis extends ConnectionPool {
  constructor (config) {
    super()
    this.init(config)
  }
  /*
          ██████  ███████ ████████ ██████  ███████ ███████ ██    ██ ██      ████████
         ██       ██         ██    ██   ██ ██      ██      ██    ██ ██         ██
         ██   ███ █████      ██    ██████  █████   ███████ ██    ██ ██         ██
         ██    ██ ██         ██    ██   ██ ██           ██ ██    ██ ██         ██
 ███████  ██████  ███████    ██    ██   ██ ███████ ███████  ██████  ███████    ██
*/
  /**
   * 
   * @param {Any} error 
   * @param {Any} data 
   */
  _getResult(error = null, data = null){
    return {
      'error': error,
      'data':data
    }
  }
  /*
         ██████  ███████  ██████  ██    ██ ███████ ███████ ████████
         ██   ██ ██      ██    ██ ██    ██ ██      ██         ██
         ██████  █████   ██    ██ ██    ██ █████   ███████    ██
         ██   ██ ██      ██ ▄▄ ██ ██    ██ ██           ██    ██
 ███████ ██   ██ ███████  ██████   ██████  ███████ ███████    ██
                             ▀▀
*/
  /**
   * 對redis發出請求
   * @param {String} fnName 
   * @param  {...any} args 
   */
  async request(fnName, ...args){
    try {
      let cClient = await this.getConnection();
      let result = await cClient[`${fnName}Async`].apply(cClient, args);
      this.release(cClient);
      return this._getResult(null, result);
    } catch (error) {
      return this._getResult(error)
    }
  }
  /*
          ██████  ███████ ████████  ██████ ██      ██ ███    ██ ███████ ████████
         ██       ██         ██    ██      ██      ██ ████   ██ ██         ██
         ██   ███ █████      ██    ██      ██      ██ ██ ██  ██ █████      ██
         ██    ██ ██         ██    ██      ██      ██ ██  ██ ██ ██         ██
 ███████  ██████  ███████    ██     ██████ ███████ ██ ██   ████ ███████    ██
*/
  /**
   * 取得客戶端實例。
   * @param {*} config 
   */
  _getClinet (config) {
    let cRedisClient = redis.createClient({
      'host': config.host || `127.0.0.1`,
      'port': config.port || 6379,
      // 'password': config.password || null,
      'db': config.db || 0,
      'tls': config.tls || null,
      'max': 1
    }).on(`error`, (error) => {
      throw new Error(`redis clinet Error : ${JSON.stringify(error, null, 2)}`)
    }).on(`connect`, () => {
      console.log(`The redis is connected！`)
    }).on(`reconnecting`, () => {
      console.log(`redis is reconnecting....`)
    })
    for(let prop in cRedisClient){
      if(typeof cRedisClient[prop] === 'function'){
        cRedisClient[`${prop}Async`] = promisify(cRedisClient[prop].bind(cRedisClient));
      }
    }
    return cRedisClient
  }
  /*
         ██████  ██ ███████  ██████  ██████  ███    ██ ███    ██ ███████  ██████ ████████
         ██   ██ ██ ██      ██      ██    ██ ████   ██ ████   ██ ██      ██         ██
         ██   ██ ██ ███████ ██      ██    ██ ██ ██  ██ ██ ██  ██ █████   ██         ██
         ██   ██ ██      ██ ██      ██    ██ ██  ██ ██ ██  ██ ██ ██      ██         ██
 ███████ ██████  ██ ███████  ██████  ██████  ██   ████ ██   ████ ███████  ██████    ██
*/
  /**
   * 斷線
   * @param {*} redisClient 
   */
  _disconnectClinet (redisClient) {
    redisClient.quit();
  }
  /*
 ███████ ██ ███    ██  ██████ ██████  ██████  ██    ██
    ███  ██ ████   ██ ██      ██   ██ ██   ██  ██  ██
   ███   ██ ██ ██  ██ ██      ██████  ██████    ████
  ███    ██ ██  ██ ██ ██      ██   ██ ██   ██    ██
 ███████ ██ ██   ████  ██████ ██   ██ ██████     ██
*/
  /**
   * 
   * @param {String} namespace 
   * @param {String} key 
   * @param {String} value 
   */
  async zincrby(namespace, key, value){
     let cResult = await this.request(`zincrby`, namespace, value, key);
     return cResult;
  }


}

module.exports = Redis
