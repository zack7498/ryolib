/*jshint esversion: 6 */
(()=>{
    "use strict";

    const dashReg = /[-]/;
    const async = require('async');
    const typeCheck = require('./typeCheck.js');
    const cCheckList = {
        number : checkNumber,
        string : checkString
    };
    /**
     *             ######  ##     ## ########  ######  ##    ##    ########  ########  ######
     *            ##    ## ##     ## ##       ##    ## ##   ##     ##     ## ##       ##    ##
     *            ##       ##     ## ##       ##       ##  ##      ##     ## ##       ##
     *            ##       ######### ######   ##       #####       ########  ######   ##   ####
     *            ##       ##     ## ##       ##       ##  ##      ##   ##   ##       ##    ##
     *            ##    ## ##     ## ##       ##    ## ##   ##     ##    ##  ##       ##    ##
     * #######     ######  ##     ## ########  ######  ##    ##    ##     ## ########  ######
     */
    /**
     * 用正則式檢查數字或字串
     * @param {String or Number} testObj 要被檢查的數字或字串
     * @param {String} regstr 正則式字串
     * @returns {Boolean} true：通過 false：不通過
     */
    function _checkReg(testObj, regstr){
        if(regstr === ''){
            return true;
        }
        const testReg = new RegExp(regstr);
        return testReg.test(testObj);
    }
    /**
     *  ######  ##     ## ########  ######  ##    ##    ##    ## ##     ## ##     ##
     * ##    ## ##     ## ##       ##    ## ##   ##     ###   ## ##     ## ###   ###
     * ##       ##     ## ##       ##       ##  ##      ####  ## ##     ## #### ####
     * ##       ######### ######   ##       #####       ## ## ## ##     ## ## ### ##
     * ##       ##     ## ##       ##       ##  ##      ##  #### ##     ## ##     ##
     * ##    ## ##     ## ##       ##    ## ##   ##     ##   ### ##     ## ##     ##
     *  ######  ##     ## ########  ######  ##    ##    ##    ##  #######  ##     ##
     */
    /**
     * 檢查數字值範圍
     * @param {number} num 要被檢查的數字
     * @param {string} range 數值範圍 EX：0-12 意思為0~12皆符合  0, 1, 3為 = 0 或 = 1 或 = 3皆符合，不使用為空字串
     * @param {string} reg 正規表示式，不使用為空字串
     * @returns {boolean} true ：符合 false：不符合
     */
    function checkNumber(num, range, reg, callback){
        let cResult = {
            checkType : typeCheck.isNumber(num),
            range : false,
            reg : _checkReg(num, reg)
        };
        if(!cResult.checkType){
            return callback(null, cResult);
        }
        if(range === ''){
            cResult.range = true;
        } else {
            let arrRange = range.split(',');
            let iLength = arrRange.length;
            for(let i = 0; i < iLength; i++){
                if(dashReg.test(arrRange[i])){
                    let arrDashRange = arrRange[i].split('-');
                    if(num >= arrDashRange[0] && num <= arrDashRange[1]){
                        cResult.range = true;
                        break;
                    }
                } else if(num === parseInt(arrRange[i])){
                    cResult.range = true;
                    break;
                }
            }
        }
        return callback(null, cResult);
    }
    /**
     *  ######  ##     ## ########  ######  ##    ##     ######  ######## ########
     * ##    ## ##     ## ##       ##    ## ##   ##     ##    ##    ##    ##     ##
     * ##       ##     ## ##       ##       ##  ##      ##          ##    ##     ##
     * ##       ######### ######   ##       #####        ######     ##    ########
     * ##       ##     ## ##       ##       ##  ##            ##    ##    ##   ##
     * ##    ## ##     ## ##       ##    ## ##   ##     ##    ##    ##    ##    ##
     *  ######  ##     ## ########  ######  ##    ##     ######     ##    ##     ##
     */
    /**
     * 檢查字串值範圍
     * @param {string} str 要被檢查的字串
     * @param {string} range 數值範圍 EX：aaa, bbb, ccc  則str = aaa 或 = bbb 或 = ccc皆符合，不使用為空字串
     * @param {string} reg 正規表示式，不使用為空字串
     * @returns {boolean} true ：符合 false：不符合
     */
    function checkString(str, range, reg, callback){
        let cResult = {
            checkType : typeCheck.isString(str),
            range : false,
            reg : _checkReg(str, reg)
        };
        if(!cResult.checkType){
            return callback(null, cResult);
        }
        if(range === ''){
            cResult.range = true;
        } else {
            let arrRange = range.split(',');
            let iLength = arrRange.length;
            let cCheckObj = {};
            for(let i = 0; i < iLength; i++){ //建立字典清單
                cCheckObj[arrRange[i]] = true;
            }
            cResult.range = cCheckObj[str] || false;
        }
        return callback(null, cResult);
    }
    /**
     *  ######  ##     ## ########  ######  ##    ##     #######  ########        ##
     * ##    ## ##     ## ##       ##    ## ##   ##     ##     ## ##     ##       ##
     * ##       ##     ## ##       ##       ##  ##      ##     ## ##     ##       ##
     * ##       ######### ######   ##       #####       ##     ## ########        ##
     * ##       ##     ## ##       ##       ##  ##      ##     ## ##     ## ##    ##
     * ##    ## ##     ## ##       ##    ## ##   ##     ##     ## ##     ## ##    ##
     *  ######  ##     ## ########  ######  ##    ##     #######  ########   ######
     */
    /**
     * 檢查物件內容
     * @param {object} obj 要被檢查的物件
     * @param {number} targetlength 指定物件長度
     * @param {object} objPropertyGlobalRule 全域檢查物件規則
     * @param {function} callback
     * @returns {boolean} true ：符合 false：不符合
     */
    function checkObj(obj, targetlength, objPropertyGlobalRule, callback){
        let cResult = {
            checkType : typeCheck.isObject(obj),
            checklength : false,
            errObj: [],
            allclear : true
        };
        if(!cResult.checkType){
            cResult.allclear = false;
            return callback(null, cResult);
        }
        if(targetlength === -1 || Object.keys(obj).length === targetlength){
            cResult.checklength = true;
        }
        if(cCheckList[objPropertyGlobalRule.type]){
            async.eachOfSeries(obj, (objItem, objKey, next)=>{
                cCheckList[objPropertyGlobalRule.type].call(this, objItem, objPropertyGlobalRule.valueRange, objPropertyGlobalRule.regExp, (err, data)=>{
                    if(!data.checkType || !data.range || !data.reg){
                        cResult.errObj.push({
                            name : objKey,
                            value : objItem,
                            targetType : objPropertyGlobalRule.type,
                            checkType : data.checkType,
                            range : data.range,
                            reg : data.reg
                        });
                    }
                    return setImmediate(next);
                });
            }, (err, result)=>{
                if(cResult.errObj.length > 0){
                    cResult.allclear = false;
                }
                return callback(null, cResult);
            });
        } else {
            return callback(null, cResult);
        }
    }

    /**
     *  ######  ##     ## ########  ######  ##    ##       ###    ########  ########     ###    ##    ##
     * ##    ## ##     ## ##       ##    ## ##   ##       ## ##   ##     ## ##     ##   ## ##    ##  ##
     * ##       ##     ## ##       ##       ##  ##       ##   ##  ##     ## ##     ##  ##   ##    ####
     * ##       ######### ######   ##       #####       ##     ## ########  ########  ##     ##    ##
     * ##       ##     ## ##       ##       ##  ##      ######### ##   ##   ##   ##   #########    ##
     * ##    ## ##     ## ##       ##    ## ##   ##     ##     ## ##    ##  ##    ##  ##     ##    ##
     *  ######  ##     ## ########  ######  ##    ##    ##     ## ##     ## ##     ## ##     ##    ##
     */
    /**
     * 檢查陣列內容
     * @param {Array} arr 要被檢查的陣列
     * @param {Number} targetlength 規定目標長度
     * @param {Array} elementRule 陣列內的元素檢查規則（僅檢查字串與數字）
     * @param {Function} callback
     */
    function checkArray(arr, targetlength, elementRule, callback){
        let cResult = {
            checkType : Array.isArray(arr),
            checklength : false,
            errObj : [],
            allclear: true
        };
        if(!cResult.checkType){
            cResult.allclear = false;
            return callback(null, cResult);
        }
        let iLength = arr.length;
        if(targetlength === -1 || iLength === targetlength){
            cResult.checklength = true;
        }
        if(elementRule.length > 0){
            async.eachSeries(elementRule, (oneElementRule, next)=>{
                if(cCheckList[oneElementRule.type]){
                    let iIndexRange =
                    ( oneElementRule.index === "-1")? [-1, -1] : oneElementRule.index.split('-');
                        _checkElement(arr,
                            oneElementRule,
                            parseInt(iIndexRange[0]),
                            parseInt(iIndexRange[1]) || -1,
                            cCheckList[oneElementRule.type],
                            (err, data)=>{
                            if(err){
                                cResult.errObj = cResult.errObj.concat(data);
                            }
                            return setImmediate(next);
                        });
                } else {
                    return setImmediate(next);
                }
            }, (err)=>{
                if(cResult.errObj.length > 0){
                    cResult.allclear = false;
                }
                return callback(null, cResult);
            });
        } else {
            return callback(null, cResult);
        }
    }

    /**
     *             ######  ##     ## ########  ######  ##    ##    ######## ##       ########
     *            ##    ## ##     ## ##       ##    ## ##   ##     ##       ##       ##
     *            ##       ##     ## ##       ##       ##  ##      ##       ##       ##
     *            ##       ######### ######   ##       #####       ######   ##       ######
     *            ##       ##     ## ##       ##       ##  ##      ##       ##       ##
     *            ##    ## ##     ## ##       ##    ## ##   ##     ##       ##       ##
     * #######     ######  ##     ## ########  ######  ##    ##    ######## ######## ########
     */
    /**
     * 用一組檢查設定來檢查陣列
     * @param {Array} arr 要被檢查的陣列
     * @param {Object} elementRule 單一組檢查設定
     * @param {Number} startIndex 檢查的起始索引 -1為全部
     * @param {Number} endIndex 檢查的結束索引
     * @param {Function} checkFn 使用的檢查方法
     * @param {Function} callback
     * @return {Array} 錯誤陣列
     */
    function _checkElement(arr, elementRule, startIndex, endIndex, checkFn, callback){
        let arrErrObj = [];
        let isErr = false;
        async.eachOfSeries(arr, (ele, index, next)=>{
            if(startIndex === -1 || (index >= startIndex && index <= endIndex) ){
                checkFn.call(this, ele, elementRule.valueRange, elementRule.regExp, (err, data)=>{
                    if(!data.checkType || !data.range || !data.reg){
                        isErr = true;
                        arrErrObj.push({
                            index : index,
                            value : ele,
                            targetType : elementRule.type,
                            checkType : data.checkType,
                            range : data.range,
                            reg : data.reg
                        });
                    }
                    return setImmediate(next);
                });
            }  else {
                return setImmediate(next);
            }
        }, (err)=> callback(isErr, arrErrObj));
    }

    module.exports = {
        checkNumber : checkNumber,
        checkString : checkString,
        checkObj : checkObj,
        checkArray : checkArray
    };

})();