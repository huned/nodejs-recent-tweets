const assert = require('assert')
const path = require('path')
const getTweets = require('../')

// NOTE: don't use arrow functions with mocha.
// See https://github.com/mochajs/mocha/issues/2018
describe('getTweets', function () {
  describe('returns well formed tweets', function () {
    it('@huned', async function () {
      const mockFile = path.join(__dirname, './data/huned-2021-11-15T04:55:05.933Z.html')
      const tweets = await getTweets('huned', { _mockURL: `file:${mockFile}` })

      assert.ok(Array.isArray(tweets))
      assert.strictEqual(tweets.length, 9)

      const tweet = tweets[0]
      assert.strictEqual(tweet.time, '2015-03-29T04:26:37.000Z')
      assert.strictEqual(tweet.textContent, 'Ignorance is our greatest enemy.')
      assert.strictEqual(tweet.permalink, 'https://twitter.com/huned/status/582036113142910976')
      assert.deepStrictEqual(tweet.links, [])
    })

    it('@newsyc250', async function () {
      const mockFile = path.join(__dirname, './data/newsyc250-2021-11-15T05:37:30.546Z.html')
      const tweets = await getTweets('newsyc250', { _mockURL: `file:${mockFile}` })

      assert.ok(Array.isArray(tweets))
      assert.strictEqual(tweets.length, 20)

      const tweet = tweets[0]
      assert.strictEqual(tweet.time, '2021-11-08T17:48:19.000Z')
      assert.strictEqual(tweet.textContent, 'The benefits of staying off social media https://durmonski.com/life-advice/benefits-of-staying-off-social-media/… (http://news.ycombinator.com/item?id=29149961…)')
      assert.strictEqual(tweet.permalink, 'https://twitter.com/newsyc250/status/1457766951720259585')
      assert.deepStrictEqual(tweet.links, [
        {
          href: 'https://t.co/keyrMBLqLX?amp=1',
          textContent: 'https://durmonski.com/life-advice/benefits-of-staying-off-social-media/…'
        },
        {
          href: 'https://t.co/fnN9jbawcu?amp=1',
          textContent: 'http://news.ycombinator.com/item?id=29149961…'
        }
      ])
    })
  })
})
