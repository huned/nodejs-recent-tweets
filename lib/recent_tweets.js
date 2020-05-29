// const URL = require('url').URL
const puppeteer = require('puppeteer')
const debug = require('debug')('recent-tweets:twitter')

const getTwitterURL = username => `https://mobile.twitter.com/${username}`

const tweetElToJSON = async tweetEl => {
  const text = await tweetEl.$eval('.tweet-text', el => el.textContent)
  debug(`extracted text: ${text}`)

  const ts = await tweetEl.$eval('.timestamp', el => el.innerText)
  debug(`extracted timestamp: ${ts}`)

  const hrefs = await tweetEl.$$eval('.tweet-text a.twitter_external_link', els => els.map(el => el.getAttribute('data-expanded-url')))
  debug(`extracted links: ${hrefs}`)

  // // Tidy up description by removing links from text
  // // TODO this whole bit is grungy, need to fix
  // for (const href of hrefs) {
  //   const host = (new URL(href)).host.replace(/^www\./, '')
  //   const r = new RegExp(`\\(?${host}\\S+…\\)?`) // TODO: Not perfect, but good enough for now.
  //   innerText = innerText.replace(r, '')
  // }
  // innerText = innerText.trim()

  const retVal = {
    ts: ts, // TODO parse into an actual timestamp
    text: text,
    hrefs: hrefs
  }

  return retVal
}

const getRecentTweets = async (username, userAgent = process.env.HTTP_USER_AGENT) => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  // NOTE: This user agent allows twitter to respond with an easy-to-parse tabular format.
  await page.setUserAgent(userAgent || 'P3P Validator')
  const url = getTwitterURL(username)

  debug(`fetching ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })
  const tweetEls = await page.$$('.tweet')
  debug(`... got ${tweetEls.length} tweets`)

  // // We only care about tweets from the last 24 hours.
  // // Unfortunately, can't use Array.filter because we need to `await`.
  // const newTweetEls = []
  // for (const el of tweetEls) {
  //   const timestampStr = await el.$eval('.timestamp', el => el.innerText)
  //   if (/\d{1,2}[hm]/.test(timestampStr)) {
  //     newTweetEls.push(el)
  //   }
  // }
  // debug(`found ${newTweetEls.length} tweets from the last 24 hours`)

  // Transform tweet into some useful JSON.
  // Unfortunately, can't use Array.map because we need to `await`.
  const tweetsJSON = []
  for (const el of tweetEls) {
    const tweetJSON = await tweetElToJSON(el)
    debug(`tweet json: ${JSON.stringify(tweetJSON)}`)
    tweetsJSON.push(tweetJSON)
  }

  await browser.close()
  return tweetsJSON
}

module.exports = getRecentTweets
