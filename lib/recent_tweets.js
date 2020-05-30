const puppeteer = require('puppeteer')
const moment = require('moment')
const timeagoReverse = require('timeago-reverse')
const debug = require('debug')('recent-tweets:twitter')

// TODO need to mock this function for tests
const getTwitterURL = username => `https://mobile.twitter.com/${username}`

const getDateFromTimestamp = ts => {
  let t = null

  // TODO this is too grungy, need to tighten it up
  if (/\d{1,2} \w{3} \d{2}/i.test(ts)) {
    t = moment(ts, 'D MMM YY').format('YYYY-MM-DD HH:mm:ss')
  } else if (/\w{3} \d{1,2}/i.test(ts)) {
    t = moment(ts, 'D MMM').format('YYYY-MM-DD HH:mm:ss')
  } else {
    const matchdata = ts.match(/(\d{1,})\s*(\w{1,})/)
    const amount = matchdata[1]
    const unitLookups = { d: 'days', h: 'hours', m: 'mins', s: 'secs' }
    const unit = unitLookups[matchdata[2]]
    t = timeagoReverse.parse(`${amount} ${unit} ago`)
  }

  return t
}

const tweetElToJSON = async tweetEl => {
  const raw = await tweetEl.$eval('.tweet-text', el => el.innerHTML.trim())
  debug(`extracted raw: ${raw}`)

  const text = await tweetEl.$eval('.tweet-text', el => el.textContent.trim())
  debug(`extracted text: ${text}`)

  const ts = await tweetEl.$eval('.timestamp', el => el.innerText.trim())
  const t = getDateFromTimestamp(ts)
  debug(`extracted timestamp: ${t}`)

  const hrefs = await tweetEl.$$eval('.tweet-text a.twitter_external_link', els => els.map(el => el.getAttribute('data-expanded-url')))
  debug(`extracted links: ${hrefs}`)

  const retVal = {
    t: t,
    text: text,
    hrefs: hrefs,
    raw: raw
  }
  return retVal
}

const getRecentTweets = async (username, userAgent = process.env.HTTP_USER_AGENT) => {
  if (!username) {
    return Promise.reject(new Error('Specify a twitter username'))
  }

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  // NOTE: This user agent allows twitter to respond with an easy-to-parse tabular format.
  await page.setUserAgent(userAgent || 'P3P Validator')
  const url = getTwitterURL(username)

  debug(`fetching ${url}`)
  await page.goto(url, { waitUntil: 'networkidle2' })
  const tweetEls = await page.$$('.tweet')
  debug(`... got ${tweetEls.length} tweets`)

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
