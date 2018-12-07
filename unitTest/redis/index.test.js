const { assert } = require(`chai`);
const util = require(`util`);
const Redis = require(`../../redis/index.js`)
let cRedis = new Redis({
  'host': `127.0.0.1`,
  'port': 6379
})

describe(`redis test`, () => {

  it(`redis.zincry`,async () => {
    for(let i = 0; i < 100000; i++){
      let cZincrby = await cRedis.zincrby(`aaa`, `bbb`, 10);
      console.log(`cZincrby : `, cZincrby);
    }
  });
})
