// const fsPromises = require('fs/promises')
const puppeteer = require('puppeteer')
const { tall } = require('tall')
const scrollAndCaptureTweets = require('./scroll_and_capture_tweets')

const debug = require('debug')('recent-tweets')

const getTweets = async (username, options = {}) => {
  // Parse options
  const headless = options.headless !== false
  const deviceDescriptor = options.deviceDescriptor || 'iPhone 11 Pro Max'
  const expandShortlinks = options.expandShortlinks || false

  if (!username) {
    throw new Error('Provide a username')
  }

  // Only for testing.
  const mockURL = options._mockURL || false

  // Initialize puppeteer
  debug('initializing puppeteer')
  const browser = await puppeteer.launch({ headless: headless })
  const page = await browser.newPage()
  await page.emulate(puppeteer.devices[deviceDescriptor])
  debug('...done')

  // Fetch tweets
  const url = `https://twitter.com/${username}`
  debug(`capturing tweets from ${url}`)
  await page.goto(mockURL || url, { waitUntil: 'networkidle2' })
  const tweets = await page.evaluate(scrollAndCaptureTweets)
  // TODO throw an error for 4xx response codes
  debug(`...done (got ${tweets.length} tweets)`)

  // Write some output that's useful for debugging/testing.
  // NOTE: to use saved html files in tests, you must modify them in two ways:
  //   1. remove the <noscript> block
  //   2. mangle the src attributes of all <script> tags. E.g., I changed
  //      "https://abs.twimg..." to "https://_abs.twimg...". Note the prepended
  //      "_" in the subdomain. This leaves the page in a state that's usable
  //      by puppeteer during tests.
  // See examples of these modified html files in `test/data`
  //
  // const timestamp = (new Date()).toISOString()
  // debug('writing tmp json')
  // await fsPromises.writeFile(`./tmp/${username}-${timestamp}.json`, JSON.stringify(tweets))
  // debug('...done')
  // debug('writing tmp html')
  // const html = await page.content()
  // await fsPromises.writeFile(`./tmp/${username}-${timestamp}.html`, html)
  // debug('...done')

  // Close puppeteer
  debug('closing puppeteer')
  await browser.close()
  debug('...done')

  // Expand t.co short links. Short links are the worst.
  // NOTE that expanding shortlinks can be slow because we have to make
  // at least one network request per shortlink.
  if (expandShortlinks) {
    debug('expanding shortlinks')
    for (const tweet of tweets) {
      for (const link of tweet.links) {
        try {
          link.href = await tall(link.href)
        } catch (error) {
          // Nothing
        }
      }
    }
    debug('...done')
  }

  return tweets
}

module.exports = getTweets
