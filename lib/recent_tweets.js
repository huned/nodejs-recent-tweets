const puppeteer = require('puppeteer')
// const moment = require('moment')
// const tall = require('tall').default
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

  const tweets = await getTweets(username)
  debug(JSON.stringify(tweets, null, 2))

  return tweets
}

module.exports = getRecentTweets
