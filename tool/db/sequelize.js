

/*jshint esversion: 6 */
(async function(){
  "use strict";

  const Sequelize = require('sequelize');
  const sequelize = new Sequelize('serSystem', 'luckylechi', 't3979076', {
    "dialect": "mssql",
    "host": "testdlp.c9glxcei5owo.ap-northeast-1.rds.amazonaws.com",
    "port": 1433,
    "pool":{
      max : 5,
      min: 0,
      acquire : 30000,
      idle: 10000
    }
  });

  async function getAccount(uid){
    let cResult = await sequelize.query(`sp_User_getAccount :Uid`,{
      replacements:{
        Uid : uid
      },
      type: sequelize.QueryTypes.SELECT }
    );
    console.log(cResult);

    return cResult;
  }
  //waiting for getAccount
  await getAccount(1);
  console.log(`我是1~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);

  await getAccount(2);
  console.log(`我是2~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);

  //not waiting for getAccount
  /**
  getAccount(1);
  await getAccount(2);
  console.log(`我是1~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
  console.log(`我是2~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
   */

})();
