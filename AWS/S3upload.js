/*jshint esversion: 6 */
(function() {
    'use strict';
    const AWS = require("aws-sdk");
    const S3RS = require(`./S3RS.js`);
    const ACLlist = {
        private : 'private',
        public_read : 'public-read',
        public_read_write : 'public_read_write',
        authenticated_read:'authenticated-read',
        aws_exec_read: 'aws-exec-read',
        bucket_owner_read: 'bucket-owner-read',
        bucket_owner_full_control: 'bucket-owner-full-control',
    };

    function doNothing(){
        return;
    }


    class Mini_S3upload {
        /**
         *
         * @param {String} targetBucketName Your Target BucketName
         * @param {String} region  Your S3 region
         * @param {String} accessKeyId Your AWS access key ID
         * @param {String} secretAccessKey Your AWS secret access key
         * @param {Object} S3options other S3 Options
         */
        constructor(targetBucketName, region, accessKeyId, secretAccessKey, S3options = {}){
            this.bucket = targetBucketName;
            S3options.region = region;
            S3options.accessKeyId = accessKeyId;
            S3options.secretAccessKey = secretAccessKey;
            this.storage = new AWS.S3(S3options);
        }
        /**
         * upload file
         * @param {String} filepath file path. EX: /ex/imange/
         * @param {String} fileName Your fileName
         * @param {String} mineType Your file mineType
         * @param {String} data Your upload data or readStream
         * @param {String} ACL This ACL to apply to the Your file. default : public_read
         * @param {Function} callback
         * @returns rsErr : readable Error.
         *          err : AWS S3 error
         *          data : AWS S3 data
         */
        uploadFile(filepath, fileName, mineType, data, ACL, callback){
            let rs = (typeof data.read !== `function` || typeof data.on !== `function`)? new S3RS(null, data):data;
            let _callback = callback;
            rs.on(`error`, (err)=>{
                _callback(err, null, null);
                _callback = null;
                return;
            });
            rs.on(`end`, ()=>{
                rs.removeListener(`error`, doNothing);
                rs.removeListener(`end`, doNothing);
            });
            this.storage.upload({
                Bucket: this.bucket,
                Key: `${filepath}/${fileName}`,
                ACL: ACLlist[ACL] || ACLlist.public_read,
                ContentType: mineType,
                Body: rs
            }, (err, data)=>{
                rs.useover();
                return (_callback)? _callback(null, err, data) : null;
            })
            .on(`httpUploadProgress`, (env)=>console.log(`nowUpload : ${env.loaded / 1024 / 1024} MB`));
        }
    }
    module.exports = Mini_S3upload;
  }());
