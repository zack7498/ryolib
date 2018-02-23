/*jshint esversion: 6 */
(()=>{
    "use strict";

    /**
     * 用物件路徑搜尋某個物件裡的物件
     * @param {Object} obj 要被搜尋的物件
     * @param {Array} arrObjPath 被split陣列化的物件路徑
     * @param {Number} index 陣列索引，預設為0，由外呼叫時不需傳入值。
     * @returns {Object} 被搜尋到的物件(搜尋不到會回傳undefined)
     */
    function getObj(obj, arrObjPath, index = 0){
        if(obj === undefined){
            console.log(`[Widget][getObj]Can not found Obj！ obj:${obj}, arrObjPath: ${arrObjPath}, index: ${index}`);
            return obj;
        } else if(arrObjPath.length > index){
            return getObj(obj[arrObjPath[index]], arrObjPath, index+1);
        }
        return obj;
    }
    /**
     * 取得指定長度的半形空白字串
     * @param {number} spaceLength 指定的空白長度
     * @returns {String} 指定長度的半形空白字串
     */
    function getSpace(spaceLength = 0){
        let sStr = ``;
        for(let i = 0; i < spaceLength; i++){
            sStr += ` `;
        }
        return sStr;
    }

    module.exports = {
        getObj : getObj,
        getSpace : getSpace
    };




})();