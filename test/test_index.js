const assert = require('assert')
const fs = require('fs')
const getRecentTweets = require('../')

// NOTE: don't use arrow functions with mocha.
// See https://github.com/mochajs/mocha/issues/2018
describe('getRecentTweets', function () {
  it('rejects without username', async function () {
    assert.rejects(getRecentTweets(), { message: /twitter username/ })
  })

  it('parses tweets into JSON', async function () {
    assert.fail('Need to reimplement for new twitter markup')

    // Allow enough time for chromium to load, etc
    this.timeout(30000)

    const mockGetHTMLFn = () => {
      const mockFile = `${process.cwd()}/test/mocks/twitter_nodeknockout_202005292057.html`
      return fs.readFileSync(mockFile).toString()
    }
    const tweets = await getRecentTweets('nodeknockout', mockGetHTMLFn)
    const tweet = tweets[0]

    assert.ok(Array.isArray(tweets))
    assert.strictEqual(tweets.length, 20)

    assert.strictEqual(tweet.t, '2019-11-25 00:00:00')
    assert.ok(/Finished my 5th @nodeknockout/.test(tweet.text))
    assert.strictEqual(tweet.hrefs[0], 'https://www.youtube.com/watch?v=JkUukMBfD4E&')
    assert.strictEqual(tweet.hrefs[1], 'https://www.nodeknockout.com/entries/53-team-tyson')
  })
})
