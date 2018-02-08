/*jshint esversion: 6 */
(()=>{
    "use strict";
    const cNumberCheck = {
        number : true
    };
    const cStringCheck = {
        string : true
    };
    const cBooleanCheck = {
        boolean : true
    };
    const cObjectCheck = {
        object : true
    };
    /**
     *檢查數字（包含NaN）
     * @param {number} num 要檢查的數字
     * @returns {boolean} true ：是  false：不是（NaN也視為不是）
     */
    function isNumber(num){
        if(isNaN(num)){
            console.log(`[Checker][typeCheck] The num is NaN！`);
            return false;
        }
        return cNumberCheck[typeof(num)] || false;
    }
    /**
     * 檢查字串
     * @param {string} str 要檢查的字串
     * @returns {boolean} true ：是  false：不是
     */
    function isString(str){
        return cStringCheck[typeof(str)] || false;
    }
    /**
     * 檢查布林
     * @param {boolean} bool 要檢查的布林
     * @returns {boolean} true ：是  false：不是
     */
    function isBoolean(bool){
        return cBooleanCheck[typeof(bool)] || false;
    }

    /**
     * 檢查物件
     * @param {object} obj 要檢查的物件
     * @returns {boolean} true ：是  false：不是
     */
    function isObject(obj){
        return cObjectCheck[typeof(obj)] || false;
    }

    module.exports = {
        isNumber : isNumber,
        isBoolean : isBoolean,
        isString : isString,
        isObject : isObject
    };
})();