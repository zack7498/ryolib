/*jshint esversion: 6 */
(()=>{
    "use strict";
    module.exports = {
        io : require('./io/index.js'),
        checker : require('./checker/index.js'),
        logger : require('./logger/index.js'),
        widget : require('./widget/index.js')
    };
})();