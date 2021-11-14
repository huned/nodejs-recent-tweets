// const fsPromises = require('fs/promises')
const puppeteer = require('puppeteer')
const { tall } = require('tall')
const captureTweets = require('./capture-tweets')

const debug = require('debug')('recent-tweets')

const getTweets = async username => {
  // Initialize puppeteer
  debug('initializing puppeteer')
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.emulate(puppeteer.devices['iPhone 7 Plus'])
  debug('...done')

  // Fetch tweets
  const url = `https://twitter.com/${username}`
  debug(`capturing tweets from ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })
  const tweets = await page.evaluate(captureTweets)
  debug(`...done (got ${tweets.length} tweets)`)

  // Write some output that's useful for debugging/testing
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

  return tweets
}

const getRecentTweets = async username => {
  let tweets = []

  try {
    tweets = await getTweets(username)
  } catch (error) {
    console.error(error)
  }

  // Expand t.co short links. Short links are the worst.
  for (const tweet of tweets) {
    for (const link of tweet.links) {
      try {
        link.href = await tall(link.href)
      } catch (error) {
        // Nothing
      }
    }
  }

  // NOTE: Comment this out because it's way too slow
  // debug(JSON.stringify(tweets, null, 2))

  return tweets
}

module.exports = getRecentTweets
