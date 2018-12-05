/*jshint esversion: 6 */
(function() {
    'use strict';

  const Jimp = require('jimp');
  const path = require('path');

  /**
   * 給予一個固定尺寸，圖片的較長邊會被縮放為固定尺寸，而另一邊則依據圖片比例縮放
   * @param  {string}   logName        使用此模組的類別名稱，務必要傳入，以例辨識。
   * @param  {string}   filePath       圖片路徑（需完整，EX: /media/d/abc.jpg）或者是個buffer
   * @param  {number}   value          縮放的固定值
   * @param  {number}   qualityPercent 圖片品質
   * @param  {string}   newFileName    處理完成的圖片檔名，空字串則為取代原圖
   * @param  {Function} callback       [description]
   * @return {string}                  處理完成後的圖片路徑，失敗則為空字串
   */
  function scaleCompression(logName, filePath, value, qualityPercent, newFileName, callback){
    Jimp.read(filePath, (err, image)=>{
      if(err){
        console.warn(`[${logName}][image-Compression] read ERROR！${err}. filePath:`);
        return callback('');
      }
      let storagePath = filePath;
      let iWidth = Jimp.AUTO;
      let iHeight = value;
      let iQuality = (qualityPercent)? qualityPercent : 80;
      let iNewFileName = (newFileName)? newFileName : '';
      if(image.bitmap.width > iHeight){
        iWidth = value;
        iHeight = Jimp.AUTO;
      }

      if(iNewFileName !== '' && !Buffer.isBuffer(filePath)){ //有檔案路徑的檔案
        let aFilePaths = filePath.split('.');
        let sFileType = aFilePaths[aFilePaths.length - 1]; //取得副檔名
        let lastSlashIndex = filePath.lastIndexOf('/'); //尋找最後一個斜線的索引位置
        storagePath = path.join(filePath.substring(0, lastSlashIndex.toString()), `${iNewFileName}.${sFileType}`);
        image.resize(iWidth, iHeight).quality(iQuality).write(storagePath, (data)=>{
        storagePath = null;
        return callback(data);
        });
      } else {
        image.resize(iWidth, iHeight).quality(iQuality).getBuffer(image.getMIME(), (err, data)=>{
          storagePath = null;
          return callback(data);
        });
      }
    });
  }

  /**
   * 圖片處理function
   * @param  {string} logName              使用此模組的類別名稱，務必要傳入，以例辨識。
   * @param  {string} filePath             圖片路徑（需完整，EX: /media/d/abc.jpg）或者是個buffer
   * @param  {Number} [width= 1280]         寬度，預設1280
   * @param  {Number} [height= 720]         高度，預設720
   * @param  {Number} [qualityPercent=80]  圖片品質，預設50%
   * @param  {String} [newFileName='']     處理完成的圖片檔名，空字串則為取代原圖，當filePath為buffer的情況下，此參數失效
   * @param  {function} [callback=function] callback，預設只是一個什麼都不做的callback
   * @return {string}                     處理完成後的圖片路徑，失敗則為空字串
   */
  function compression(logName, filePath, width, height, qualityPercent, newFileName, callback){
    Jimp.read(filePath, (err, image)=>{
      if(err){
        console.warn(`[${logName}][image-Compression] read ERROR！${err}. filePath:`);
        return callback('');
      }
      let storagePath = filePath;
      let iWidth = (width)? width : 1280;
      let iHeight = (height)? height : 720;
      let iQuality = (qualityPercent)? qualityPercent : 80;
      let iNewFileName = (newFileName)? newFileName : '';
      if(iNewFileName !== '' && !Buffer.isBuffer(filePath)){
        let aFilePaths = filePath.split('.');
        let sFileType = aFilePaths[aFilePaths.length - 1]; //取得副檔名
        let lastSlashIndex = filePath.lastIndexOf('/'); //尋找最後一個斜線的索引位置
        storagePath = path.join(filePath.substring(0, lastSlashIndex.toString()), `${iNewFileName}.${sFileType}`);
        image.resize(iWidth, iHeight).quality(iQuality).write(storagePath, (data)=>{
          return callback(data);
        });
      } else {
        image.resize(iWidth, iHeight).quality(iQuality).getBuffer(image.getMIME(), (data)=>{
          storagePath = null;
          return callback(data);
        });
      }
    });
  }
  module.exports = {
    compression : compression,
    scaleCompression : scaleCompression
  };
  }());
