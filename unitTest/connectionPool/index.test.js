const { assert } = require('chai')
const ConnectionPool = require(`../../connectionPool/index.js`)

describe(`test ConnectionPool`, () => {
  it(`new ConnectionPool`, () => {
    let cError = null
    try {
      let cObj = new ConnectionPool()
    } catch (error) {
      cError = error
    }
    assert(cError, `the connectionPool was instantiated!!`)
  })
})
