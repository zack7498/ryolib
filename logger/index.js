/*jshint esversion: 6 */
(()=>{

    let log4js = require('log4js');
    log4js.configure(require('../../../config/log4js.json'));
    const sysLog = log4js.getLogger('MainSystem');
    const APIFilterLog = log4js.getLogger('APIFilter');
      module.exports = {
          sysLog : sysLog,
          APIFilter : APIFilterLog
      };
})();