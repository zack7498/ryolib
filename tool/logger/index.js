/*jshint esversion: 6 */
(()=>{
    "use strict";
    let log4js = require('log4js');
    const path = require('path');
    log4js.configure(require(path.resolve(__dirname, '../../../config/log4js.json')));
    const sysLog = log4js.getLogger('MainSystem');
    const APIFilterLog = log4js.getLogger('APIFilter');
      module.exports = {
          sysLog : sysLog,
          APIFilter : APIFilterLog
      };
})();