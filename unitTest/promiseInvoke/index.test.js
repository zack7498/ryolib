'use strict';
const promiseInvoke = require('../../promiseInvoke/index.js');
const { assert } = require('chai');

class TestClass {
  constructor (msg) {
    this.msg = msg;
  }
  print (callback) {
    console.log(`msg :`, this.msg);
    return callback(null, this.msg);
  }
}

describe('promiseInvoke', () => {
  it('invoke(static function)', async () => {
    const testFn = function (msg, callback) {
      return callback(null, `msg :${msg}. \n hello world!`);
    };
    let cResult = await promiseInvoke(testFn, `aabbcc`);
    console.log(cResult);

    assert(!cResult.error, `the result has error！`);
    assert(cResult.result === `msg :aabbcc. \n hello world!`, `the result is not match`);
  });

  it('invoke(have this function)', async () => {
    let str = 'okok';
    let tClass = new TestClass(str);
    let cResult = await promiseInvoke(tClass.print.bind(tClass));
    console.log(cResult);
    assert(!cResult.error, `the rsult has error : ${cResult.error}`);
    assert(cResult.result === str, `the result is not match`);
  });
})
;
