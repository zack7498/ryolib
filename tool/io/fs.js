
'use strict';

const fs = require('fs');
const path = require('path');
const promiseInvoke = require('../../promiseInvoke/index.js');
const jsonReg = /\.json$/;
const extReg = /\./; // 辨別檔名或資料夾

function _returnResult (error = null, data = null) {
  return {
    'error': error,
    'data': data
  };
}

class Rfs {
  /**
#          ██████ ██   ██ ███████  ██████ ██   ██ ██████   █████  ████████ ██   ██
#         ██      ██   ██ ██      ██      ██  ██  ██   ██ ██   ██    ██    ██   ██
#         ██      ███████ █████   ██      █████   ██████  ███████    ██    ███████
#         ██      ██   ██ ██      ██      ██  ██  ██      ██   ██    ██    ██   ██
# ███████  ██████ ██   ██ ███████  ██████ ██   ██ ██      ██   ██    ██    ██   ██
 */
  /**
     *
     * @param {String} filepath [路徑，建議使用絕對路徑]
     * @returns {Object} {error, result}
     */
  static async _checkPath (filepath) {
    let cCheckResult = await promiseInvoke(fs.access.bind(fs), filepath, fs.constants.F_OK);
    return cCheckResult;
  }
  /**
# ███    ███ ██   ██ ██████  ██ ██████
# ████  ████ ██  ██  ██   ██ ██ ██   ██
# ██ ████ ██ █████   ██   ██ ██ ██████
# ██  ██  ██ ██  ██  ██   ██ ██ ██   ██
# ██      ██ ██   ██ ██████  ██ ██   ██
 */
  /**
   *
   * @param {Stirng} filepath
   * @returns {Object}
   */
  static async mkdir (filepath) {
    let cMkdirResult = await promiseInvoke(fs.mkdir.bind(fs), filepath, null);
    return cMkdirResult;
  }
  /*
 ██████  ███████  █████  ██████  ██████  ██ ██████
 ██   ██ ██      ██   ██ ██   ██ ██   ██ ██ ██   ██
 ██████  █████   ███████ ██   ██ ██   ██ ██ ██████
 ██   ██ ██      ██   ██ ██   ██ ██   ██ ██ ██   ██
 ██   ██ ███████ ██   ██ ██████  ██████  ██ ██   ██
*/
  /**
   *
   * @param {String} filepath
   * @returns {Object}
   */
  static async readdir (filepath) {
    let cReadDir = await promiseInvoke(fs.readdir.bind(fs), filepath, 'utf8');
    return cReadDir;
  }
  /**
#         ██ ███████     ██████  ██ ██████  ███████  ██████ ████████  ██████  ██████  ██    ██
#         ██ ██          ██   ██ ██ ██   ██ ██      ██         ██    ██    ██ ██   ██  ██  ██
#         ██ ███████     ██   ██ ██ ██████  █████   ██         ██    ██    ██ ██████    ████
#         ██      ██     ██   ██ ██ ██   ██ ██      ██         ██    ██    ██ ██   ██    ██
# ███████ ██ ███████     ██████  ██ ██   ██ ███████  ██████    ██     ██████  ██   ██    ██
 */
  /**
     * 檢查路徑上的檔案是否為資料夾
     * @param {String} filepath 路徑，建議使用絕對路徑
     * @return {Object}
     */
  static async _isDirectory (filepath) {
    let cStatResult = await promiseInvoke(fs.stat.bind(fs), filepath);
    if (cStatResult.error) {
      return cStatResult;
    } else if (cStatResult.result.isDirectory()) {
      return _returnResult(null, true);
    }
    return _returnResult(null, false);
  }
  /*
 ██████  ███████  █████  ██████  ███████ ██ ██      ███████
 ██   ██ ██      ██   ██ ██   ██ ██      ██ ██      ██
 ██████  █████   ███████ ██   ██ █████   ██ ██      █████
 ██   ██ ██      ██   ██ ██   ██ ██      ██ ██      ██
 ██   ██ ███████ ██   ██ ██████  ██      ██ ███████ ███████
*/
  /**
   *
   * @param {String} filepath
   */
  static async readFile (filepath) {
    let cReadFile = await promiseInvoke(fs.readFile.bind(fs), filepath, 'utf8');
    return cReadFile;
  }
  /**
# ██████  ███████  █████  ██████  ██████  ██ ██████           ██ ███████  ██████  ███    ██
# ██   ██ ██      ██   ██ ██   ██ ██   ██ ██ ██   ██          ██ ██      ██    ██ ████   ██
# ██████  █████   ███████ ██   ██ ██   ██ ██ ██████           ██ ███████ ██    ██ ██ ██  ██
# ██   ██ ██      ██   ██ ██   ██ ██   ██ ██ ██   ██     ██   ██      ██ ██    ██ ██  ██ ██
# ██   ██ ███████ ██   ██ ██████  ██████  ██ ██   ██      █████  ███████  ██████  ██   ████
 */
  /**
   *
   * @param {String} filepath
   * @param {Object} jsonList
   */
  static async readDirJSONfile (filepath, jsonList = {}) {
    let arrFileList = await this.readdir(filepath);
    for (let fileName of arrFileList) {
      if (jsonReg.test(fileName)) {
        const sFilePath = path.join(filepath, fileName);
        let sPropName = fileName.split('.')[0];
        let cReadFile = this.readFile(filepath);
        try {
          jsonList[sPropName] = JSON.parse(cReadFile.result);
          Object.defineProperty(jsonList[sPropName], 'path', {
            enumerable: false,
            value: sFilePath,
            writable: false
          });
        } catch (error) {
          console.log(`The JSON parse is failed. Filepath : ${sFilePath}. ERROR : ${error}`);
        }
      } else if (extReg.test(fileName)) { // 其他格式檔案略過
        continue;
      }
      const sDirPath = path.join(filepath, fileName);
      jsonList[fileName] = {};
      Object.defineProperty(jsonList[fileName], 'path', {
        enumerable: false,
        value: sDirPath,
        writable: false
      });
      let cDirectoryResult = await this._isDirectory(sDirPath);
      if (cDirectoryResult.result) {
        await this.readDirJSONfile(sDirPath, jsonList[fileName]);
      }
    }
  }
  /**
# ███████  █████  ██    ██ ███████ ███████ ██ ██      ███████
# ██      ██   ██ ██    ██ ██      ██      ██ ██      ██
# ███████ ███████ ██    ██ █████   █████   ██ ██      █████
#      ██ ██   ██  ██  ██  ██      ██      ██ ██      ██
# ███████ ██   ██   ████   ███████ ██      ██ ███████ ███████
 */
  /**
   *  寫入檔案
   * @param {String} filepath [檔案路徑]
   * @param {Any} data [要儲存的資料]
   */
  static async saveFile (filepath, data) {
    let cWriteFile = await promiseInvoke(fs.watchFile.bind(fs), filepath, data);
    return cWriteFile;
  }
}

module.exports = Rfs;
