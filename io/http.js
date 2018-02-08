/*jshint esversion: 6 */
(()=>{
    const request = require('request');

    function httpPoster(uri, route, callback){
        request.post(`${uri}${route}`, (err, res, body)=> callback(err, body));
    }

    function httpgetter(uri, route, callback){
        request.get(`${uri}${route}`, (err, res, body)=> callback(err, body));
    }

    module.exports = {
        httpPoster : httpPoster,
        httpgetter : httpgetter
    };



})();