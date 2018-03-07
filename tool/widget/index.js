/*jshint esversion: 6 */
(() => {
    "use strict";
    /**
    #  ██████  ███████ ████████      ██████  ██████       ██
    # ██       ██         ██        ██    ██ ██   ██      ██
    # ██   ███ █████      ██        ██    ██ ██████       ██
    # ██    ██ ██         ██        ██    ██ ██   ██ ██   ██
    #  ██████  ███████    ██         ██████  ██████   █████
     */
    /**
     * 用物件路徑搜尋某個物件裡的物件
     * @param {Object} obj 要被搜尋的物件
     * @param {Array} arrObjPath 被split陣列化的物件路徑
     * @param {Number} index 陣列索引，預設為0，由外呼叫時不需傳入值。
     * @returns {Object} 被搜尋到的物件(搜尋不到會回傳undefined)
     */
    function getObj(obj, arrObjPath, index = 0) {
        if (obj === undefined) {
            console.log(`[Widget][getObj]Can not found Obj！ obj:${obj}, arrObjPath: ${arrObjPath}, index: ${index}`);
            return obj;
        } else if (arrObjPath.length > index) {
            return getObj(obj[arrObjPath[index]], arrObjPath, index + 1);
        }
        return obj;
    }
    /**
    #  ██████  ███████ ████████     ███████ ██████   █████   ██████ ███████
    # ██       ██         ██        ██      ██   ██ ██   ██ ██      ██
    # ██   ███ █████      ██        ███████ ██████  ███████ ██      █████
    # ██    ██ ██         ██             ██ ██      ██   ██ ██      ██
    #  ██████  ███████    ██        ███████ ██      ██   ██  ██████ ███████
     */
    /**
     * 取得指定長度的半形空白字串
     * @param {number} spaceLength 指定的空白長度
     * @returns {String} 指定長度的半形空白字串
     */
    function getSpace(spaceLength = 0) {
        let sStr = ``;
        for (let i = 0; i < spaceLength; i++) {
            sStr += ` `;
        }
        return sStr;
    }
    /**
    # ██████  ███████ ███████ ██████   ██████  ██████  ██████  ██    ██
    # ██   ██ ██      ██      ██   ██ ██      ██    ██ ██   ██  ██  ██
    # ██   ██ █████   █████   ██████  ██      ██    ██ ██████    ████
    # ██   ██ ██      ██      ██      ██      ██    ██ ██         ██
    # ██████  ███████ ███████ ██       ██████  ██████  ██         ██
     */
    /**
     * 深層複製
     * @param {Object} targetObj 要被複製的物件
     * @returns {Object}
     */
    function deepCopy(targetObj) {
        return JSON.parse(JSON.stringify(targetObj));
    }

    /**
    #         ███████ ██ ██      ██       ██████  ██████       ██
    #         ██      ██ ██      ██      ██    ██ ██   ██      ██
    #         █████   ██ ██      ██      ██    ██ ██████       ██
    #         ██      ██ ██      ██      ██    ██ ██   ██ ██   ██
    # ███████ ██      ██ ███████ ███████  ██████  ██████   █████
     */
    /**
     *  填補空物件，如果填補的途中發現路徑不存在，則路徑上會被填補空物件。
     * @param {Object} obj 會被填補的物件
     * @param {Array} arrObjPath 物件路徑
     * @param {Number} index 遞迴層數
     */
    function fillObj(obj, arrObjPath, index = 0) {
        if (!obj[arrObjPath[index]] && arrObjPath.length === index + 1) {
            obj[arrObjPath[index]] = {};
            return obj[arrObjPath[index]];
        } else if (!obj[arrObjPath[index]]) {
            obj[arrObjPath[index]] = {};
        }
        return fillObj(obj[arrObjPath[index]], arrObjPath, index + 1);
    }
/*
██████   █████  ██████  ███████ ███████ ██ ███████  ██████  ████████ ██ ███    ███ ███████
██   ██ ██   ██ ██   ██ ██      ██      ██ ██      ██    ██    ██    ██ ████  ████ ██
██████  ███████ ██████  ███████ █████   ██ ███████ ██    ██    ██    ██ ██ ████ ██ █████
██      ██   ██ ██   ██      ██ ██      ██      ██ ██    ██    ██    ██ ██  ██  ██ ██
██      ██   ██ ██   ██ ███████ ███████ ██ ███████  ██████     ██    ██ ██      ██ ███████
*/
/**
 * 將String時間轉成 格林威治時間(+0)的 TimeStamp 未指定時區時不做更換 未傳入時間時使用系統時間
 * @param  {String} date     javascript 支援的時間字串格式
 * @param  {Number} timeZone 時區 +12 ~ -12
 * @return {Number}          格林威治時間的 TimeStamp
 */
    function parseISOTime(date, timeZone) {

        let iTimeStamp = 0;
        if(date){
          iTimeStamp = new Date(date).getTime();
          if(timeZone){
            iTimeStamp -= timeZone * 60 * 60 * 1000;
          }
        } else {
          iTimeStamp = new Date().getTime();
        }
        return iTimeStamp;
      };

    module.exports = {
        getObj: getObj,
        getSpace: getSpace,
        deepCopy: deepCopy,
        fillObj: fillObj,
        parseISOTime : parseISOTime
    };
})();