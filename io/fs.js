/*jshint esversion: 6 */
(()=>{
    "use strict";

    const fs = require('fs');
    const path = require('path');
    const async = require('async');
    const jsonReg = /\.json$/;
    const extReg = /\./; //辨別檔名或資料夾

    /**
     * 檢查路徑是否存在
     * @param {string} filepath 路徑，建議使用絕對路徑
     * @param {function} callback
     */
    function _checkPath(filepath, callback){
        fs.access(path, fs.constants.F_OK, (err)=>{
            return callback(err, (err)? false : true);
        });
    }
    /**
     * 新增資料夾
     * @param {string} filepath 路徑，建議使用絕對路徑
     * @param {function} callback
     */
    function _mkdir(filepath, callback){
        fs.mkdir(filepath, null, function(err){
            return callback(err, (err)? false : true);
          });
    }
    /**
     * 讀取資料夾內容
     * @param {string} filepath 路徑，建議使用絕對路徑
     * @param {function} callback
     */
    function _readdir(filepath){
        return fs.readdirSync(filepath);
    }

    /**
     * 讀取檔案內容
     * @param {string} filepath 路徑，建議使用絕對路徑
     * @param {function} callback
     */
    function _readfile(filepath, callback){
        fs.readFile(filepath, 'utf8', (err, data)=>{
            if(err){
                console.log(`[io][rfs][_readfile] ERROR : ${err}`);
            }
            return callback(err, data);
        });
    }
    /**
     * 檢查路徑上的檔案是否為資料夾
     * @param {string} filepath 路徑，建議使用絕對路徑
     * @param {function} callback
     * @return true : 是資料夾 false : 不是
     */
    function _isDirectory(filepath, callback) {
        fs.stat(filepath, function(err, data){
            if(err){
                return callback(err);
            } else if(data.isDirectory()){
                return callback(null, true);
            }
            return callback(null, false);
        });
    }
    /**
     * 讀取指定路徑下的所有JSON檔案，並根據路徑結構產生物件回傳
     * @param {string} filepath 路徑，建議使用絕對路徑
     * @param {function} callback
     * @param {object} jsonList JSON物件，由function本身使用。外部不需傳入值
     */
    function readDirJSONfile(filepath, callback, jsonList){
        let arrFileList = _readdir(filepath);
        jsonList = (jsonList)? jsonList : {};

        async.eachSeries(arrFileList, (fileName, next)=>{
            let isJson = jsonReg.test(fileName);
            let isfile = extReg.test(fileName);
            if(isJson){
                const sFilePath = path.join(filepath, fileName);
                let sObjName = fileName.split('.')[0];
                _readfile(sFilePath, (err, data)=>{
                    jsonList[sObjName] = JSON.parse(data);
                    jsonList[sObjName].path = sFilePath;
                    return setImmediate(next, err);
                });
            } else if(isfile){ //其他格式檔案略過
                return setImmediate(next);
            } else { //讀取資料夾
                const sDirPath = path.join(filepath, fileName);
                jsonList[fileName] = {
                    path : sDirPath
                };
                _isDirectory(sDirPath, (err, data)=>{
                    if(err){
                        return setImmediate(next, err);
                    } else if(!data){
                        return setImmediate(next);
                    }
                    return readDirJSONfile(sDirPath, next, jsonList[fileName]);
                });
            }
        }, function(err){
            if(err){
                console.log(`[io][rfs][readDirJSONfile] ERROR : ${err}`);
            }
            return callback(err, jsonList);
        });
    }

    function saveFile(filepath, callback) {
        fs.writeFile(filepath, (err)=>{
            if(err){
                console.log(`[io][rfs][saveFile] ERROR : ${err}`);
            }
            return callback(err);
        });
    }

    module.exports = {
        readDirJSONfile : readDirJSONfile,
        saveFile : saveFile
    };
})();


