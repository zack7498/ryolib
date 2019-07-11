'use strict';

const deasync = require('deasync');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

async function delay (interval) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, interval);
  });
}

class MongoCenter {
  constructor () {
    this.mongodb = mongodb;
    this.clientList = {};
    this.cacheCollectionList = {};
    this.initLock = {};
  }
  /*
          ██████ ██   ██ ███████  ██████ ██   ██  ██████ ██      ██ ███████ ███    ██ ████████
         ██      ██   ██ ██      ██      ██  ██  ██      ██      ██ ██      ████   ██    ██
         ██      ███████ █████   ██      █████   ██      ██      ██ █████   ██ ██  ██    ██
         ██      ██   ██ ██      ██      ██  ██  ██      ██      ██ ██      ██  ██ ██    ██
 ███████  ██████ ██   ██ ███████  ██████ ██   ██  ██████ ███████ ██ ███████ ██   ████    ██
*/
  /**
   * 檢查client是否存在
   * @param {String} database 資料庫名稱
   * @returns {Boolean}
   */
  async _checkClient (database) {
    if (this.initLock[database]) { // 正在init
      while (this.initLock[database]) {
        console.log(`init lock~`);

        await delay(1000);
      }
      console.log(`init lock over!`);
      return !!(this.clientList[database]);
    } else {
      return !!(this.clientList[database]);
    }
  }
  /*
          ██████ ██   ██ ███████  ██████ ██   ██  ██████ ██      ██ ███████ ███    ██ ████████
         ██      ██   ██ ██      ██      ██  ██  ██      ██      ██ ██      ████   ██    ██
         ██      ███████ █████   ██      █████   ██      ██      ██ █████   ██ ██  ██    ██
         ██      ██   ██ ██      ██      ██  ██  ██      ██      ██ ██      ██  ██ ██    ██
 ███████  ██████ ██   ██ ███████  ██████ ██   ██  ██████ ███████ ██ ███████ ██   ████    ██
*/
  /**
   * 取得集合的快取
   * @param {Object} db mongodb instance
   * @param {String} databaseName db name
   * @param {String} collectionName 集合名稱
   * @returns {Boolean}
   */
  async _getCollection (db, databaseName, collectionName) {
    let cCollection = this.cacheCollectionList[databaseName][collectionName];
    if (!cCollection) {
      db.collection(collectionName, {
        'strict': true
      }, (err, collection) => {
        if (err) {
          return null;
        }
        cCollection = collection;
        this.cacheCollectionList[databaseName][collectionName] = collection;
        return collection;
      });
    } else {
      return cCollection;
    }
  }
  /*
           ██ ███    ██ ██ ████████  ██████ ██      ██ ███████ ███    ██ ████████
           ██ ████   ██ ██    ██    ██      ██      ██ ██      ████   ██    ██
           ██ ██ ██  ██ ██    ██    ██      ██      ██ █████   ██ ██  ██    ██
           ██ ██  ██ ██ ██    ██    ██      ██      ██ ██      ██  ██ ██    ██
   ███████ ██ ██   ████ ██    ██     ██████ ███████ ██ ███████ ██   ████    ██
  */
  /**
   * 初始化連線實例
   * @param {Object} linkInfo 連線至資料庫的資訊
   * @returns {Object} 目標資料庫的連線實例
   */
  async _initClient ({
    host = '',
    port = 27017,
    database = '',
    user = '',
    password = '',
    isAuth = false,
    poolSize = 10
  }) {
    this.initLock[database] = true;
    let cOptionObj = {
      'useNewUrlParser': true,
      'minSize': 5,
      'poolSize': poolSize,
      'forceServerObjectId': true,
      'keepAlive': true,
      'reconnectTries': 3600,
      'auth': (isAuth) ? {
        'user': user,
        'password': password
      } : null
    };
    try {
      this.clientList[database] = await MongoClient.connect(`mongodb://${host}:${port}`, cOptionObj).catch((err) => {
        throw new Error(err);
      });
      console.log(`[Mongo][${database}] connect success！`);
      this.cacheCollectionList[database] = {};
      this.initLock[database] = false;
      return this.clientList[database];
    } catch (error) {
      console.error(`[Mongo][${database}] connect failed with Error:${error}`);
      return null;
    }
  }
  /*
    ██████  ███████ ████████  ██████ ██      ██ ███████ ███    ██ ████████
   ██       ██         ██    ██      ██      ██ ██      ████   ██    ██
   ██   ███ █████      ██    ██      ██      ██ █████   ██ ██  ██    ██
   ██    ██ ██         ██    ██      ██      ██ ██      ██  ██ ██    ██
    ██████  ███████    ██     ██████ ███████ ██ ███████ ██   ████    ██
  */
  /**
   * 取得目標collection連線實例
   * @param {Object} linkInfo 連線資訊config
   * @param {String} database 資料庫名稱
   * @param {String} collection collection名稱
   * @param {Object} option 可選選項。
   *  {Boolean} autoCreateCollection : 如果collection不存在，是否自動建立。
   *  {Object} collectionOption : 建立新collection時的自訂選項，其選項內容同MongoClient.createCollection
   *  {Array} indexList ：建立新collection時，要建立的索引名稱陣列，每個元素為一個索引名稱
   *  {Number} expireAfterSeconds : 是否有過期時間（以秒為單位），-1為無，>0的情況則會自動建立一個名為autoCreateTime的索引，
   * @returns {Object} connectObject 目標collection的連線實例
   */
  async getClient (linkInfo = {
    'host': '',
    'port': 0,
    'isAuth': false,
    'poolSize': 10,
    'autoCreateCollection': false,
    'collectionOption': {},
    'indexList': [],
    'expireAfterSeconds': -1,
    'expireKey': '',
    'database': '',
    'collection': ''
  }) {
    let cClient = null;
    let sDatabase = linkInfo.database;
    let sCollection = linkInfo.collection;
    let cCheck = await this._checkClient(sDatabase);
    if (!cCheck) {
      cClient = await this._initClient(linkInfo, sDatabase);
    } else {
      cClient = this.clientList[sDatabase];
    }
    let cDB = cClient.db(sDatabase);
    let cCollection = await this._getCollection(cDB, sDatabase, sCollection);
    if (cCollection) {
      return cCollection;
    } else if (!linkInfo.autoCreateCollection) {
      return null;
    }
    try {
      let cCollection = await cDB.createCollection(sCollection).catch((err) => {
        throw new Error(err);
      });
      if (linkInfo.expireAfterSeconds > 0) {
        await cCollection.createIndex(linkInfo.expireKey, {
          'expireAfterSeconds': linkInfo.expireAfterSeconds
        });
      }
      if (linkInfo.indexList.length > 0) { // 複合索引
        let iLength = linkInfo.indexList.length;
        for (let i = 0; i < iLength; i++) {
          let isUnique = (linkInfo.indexList[i].$unique === true);
          delete linkInfo.indexList[i].$unique;
          if (isUnique) {
            await cCollection.createIndex(linkInfo.indexList[i], {
              unique: true
            });
          } else {
            await cCollection.createIndex(linkInfo.indexList[i]);
          }
        }
      }
      this.cacheCollectionList[sDatabase][sCollection] = cCollection;
      return cCollection;
    } catch (error) {
      console.error(`[Mongo][${sDatabase}][getClient] createCollection failed：`, error);
      return null;
    }
  }
}

let cMongoCenter = new MongoCenter();

module.exports = function (linkInfo) {
  let cConnection = null;
  cMongoCenter.getClient(linkInfo).then(resolve => {
    cConnection = resolve;
  });
  deasync.loopWhile(() => !cConnection);
  return cConnection;
  // console.log(`cConnection`, cConnection);
  // return cConnection;
};
