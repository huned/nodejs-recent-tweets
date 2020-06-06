const cheerio = require('cheerio')
const bent = require('bent')
const moment = require('moment')
const timeagoReverse = require('timeago-reverse')
const debug = require('debug')('recent-tweets:twitter')

// TODO need to mock this function for tests
const getTwitterURL = username => `https://mobile.twitter.com/${username}`

const getDateFromTimestamp = ts => {
  const now = new Date()
  let t = null

  // TODO this is too grungy -- and SLOW -- need to tighten it up
  if (/\d{1,2} \w{3} \d{2}/i.test(ts)) {
    t = moment(ts, 'D MMM YY').format('YYYY-MM-DD HH:mm:ss')
  } else if (/\w{3} \d{1,2}/i.test(ts)) {
    t = moment(ts, 'MMM D')
    if (t.toDate() > now) {
      t = t.subtract(1, 'year')
    }
    t = t.format('YYYY-MM-DD HH:mm:ss')
  } else {
    const matchdata = ts.match(/(\d{1,})\s*(\w{1,})/)
    const amount = matchdata[1]
    const unitLookups = { d: 'days', h: 'hours', m: 'mins', s: 'secs' }
    const unit = unitLookups[matchdata[2]]
    t = timeagoReverse.parse(`${amount} ${unit} ago`)
  }

  return t
}

const tweetElToJSON = tweetEl => {
  const $tweetEl = cheerio(tweetEl)

  const raw = $tweetEl.find('.tweet-text').html()
  debug(`extracted raw: ${raw}`)

  const text = $tweetEl.find('.tweet-text').text()
  debug(`extracted text: ${text}`)

  const ts = $tweetEl.find('.timestamp').text()
  const t = getDateFromTimestamp(ts)
  debug(`extracted timestamp: ${t}`)

  const hrefs = $tweetEl.find('.twitter_external_link').get().map(el => cheerio(el).data('expanded-url'))
  debug(`extracted links: ${hrefs}`)

  const retVal = {
    t: t,
    text: text,
    hrefs: hrefs,
    raw: raw
  }

  debug(`returning tweet json: ${JSON.stringify(retVal)}`)
  return retVal
}

const getHTML = bent('GET', 200, 'string', {
  // NOTE: This user agent allows twitter to respond with an easy-to-parse tabular format.
  'User-Agent': process.env.HTTP_USER_AGENT || 'P3P Validator'
})

const getRecentTweets = async (username, getHTMLFn = getHTML) => {
  if (!username) {
    return Promise.reject(new Error('Specify a twitter username'))
  }

  const url = getTwitterURL(username)
  debug(`fetching ${url}`)
  const html = await getHTMLFn(url)
  const $ = cheerio.load(html)
  const tweetEls = $('.tweet')
  debug(`... got ${tweetEls.length} tweets`)

  // Transform tweet into some useful JSON.
  const tweetsJSON = tweetEls.get().map(el => {
    const tweetJSON = tweetElToJSON(el)
    debug(`tweet json: ${JSON.stringify(tweetJSON)}`)
    return tweetJSON
  })

  // console.dir(tweetsJSON)

  // debug(`returning: ${JSON.stringify(tweetsJSON)}`)
  return tweetsJSON
}

module.exports = getRecentTweets
