/*jshint esversion: 6 */
(()=>{
    "use strict";
    const request = require('request');
/**
# ██   ██ ████████ ████████ ██████      ██████   ██████  ███████ ████████ ███████ ██████
# ██   ██    ██       ██    ██   ██     ██   ██ ██    ██ ██         ██    ██      ██   ██
# ███████    ██       ██    ██████      ██████  ██    ██ ███████    ██    █████   ██████
# ██   ██    ██       ██    ██          ██      ██    ██      ██    ██    ██      ██   ██
# ██   ██    ██       ██    ██          ██       ██████  ███████    ██    ███████ ██   ██
 */
    /**
     * http post方法
     * @param {string} uri
     * @param {string} route
     * @param {Object} param
     * @param {function} callback
     */
    function httpPoster(uri, route, param, callback){
        request.post({
            timeout : 15000,
            url: `${uri}${route}`,
            json: param
          }, (err, res, body)=> callback(err, body));
    }
/**
# ██   ██ ████████ ████████ ██████       ██████  ███████ ████████ ████████ ███████ ██████
# ██   ██    ██       ██    ██   ██     ██       ██         ██       ██    ██      ██   ██
# ███████    ██       ██    ██████      ██   ███ █████      ██       ██    █████   ██████
# ██   ██    ██       ██    ██          ██    ██ ██         ██       ██    ██      ██   ██
# ██   ██    ██       ██    ██           ██████  ███████    ██       ██    ███████ ██   ██
 */
    /**
     * http get方法
     * @param {string} uri
     * @param {string} route
     * @param {function} callback
     */
    function httpGetter(uri, route, callback){
        request.get(`${uri}${route}`, (err, res, body)=> callback(err, body));
    }

    module.exports = {
        httpPoster : httpPoster,
        httpGetter : httpGetter
    };



})();