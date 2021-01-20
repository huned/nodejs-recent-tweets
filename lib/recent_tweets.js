const puppeteer = require('puppeteer')
const tall = require('tall').default
const captureTweets = require('./capture-tweets')
const debug = require('debug')('recent-tweets:twitter')

const getTweets = async username => {
  // Initialize puppeteer
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  // page.emulate(puppeteer.devices['iPhone 7 Plus'])

  // Fetch tweets
  const url = `https://twitter.com/${username}`
  debug(`fetching ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })
  const tweets = await page.evaluate(captureTweets)
  debug(`got ${tweets.length} tweets`)

  // Close puppeteer
  await browser.close()

  return tweets
}

const getRecentTweets = async (username) => {
  if (!username) {
    return Promise.reject(new Error('Specify a twitter username'))
  }

  let tweets
  try {
    tweets = await getTweets(username)
  } catch(err) {
    debug(`Error getting tweets: ${err.message}`)
    tweets = []
  }

  // Expand t.co short links. Short links are the worst.
  for (const tweet of tweets) {
    for (const link of tweet.links) {
      try {
        link.href = await tall(link.href)
      } catch (err) {
        // Nothing
      }
    }
  }

  debug(JSON.stringify(tweets, null, 2))

  return tweets
}

module.exports = getRecentTweets
