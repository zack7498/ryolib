
const util = require('util');

module.exports = async function promiseInvoke (fn, ...args) {
  const pFn = util.promisify(fn);
  let cReuslt = {
    'error': null,
    'result': null
  };
  cReuslt.result = await pFn.apply(null, args).catch((error) => {
    cReuslt.error = error;
    return null;
  });
  return cReuslt;
};
