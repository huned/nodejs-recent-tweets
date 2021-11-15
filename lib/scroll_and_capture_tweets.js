// Capture tweets from the DOM as we scroll the page. We have to resort to this
// method of getting the tweets b/c twitter annoyingly modifies the DOM to
// insert/remove tweet elements as you scroll. Thus, you can't simply scroll the
// page a bunch and then invoke a single querySelectorAll to get all tweets.
// What a waste of compute resources.
//
// NOTE: I leave console.log uncommented here because it runs in puppeteer,
// and the output is useful there.
const captureTweets = async (maxScrollCount = 5) => {
  // A sleep utility function.
  const sleep = async durationMillseconds => {
    await new Promise(resolve => {
      setTimeout(resolve, durationMillseconds)
    })
  }

  // This function transforms a tweet DOM element to a tweet JSON object.
  // NOTE this function has limitations:
  // - doesn't work with retweets
  // - doesn't work with tweets that don't contain text
  // - probably others
  const tweet2json = tweetEl => {
    console.log(tweetEl)

    const tweet = {
      time: undefined,
      permalink: undefined,
      textContent: undefined,
      links: []
    }

    // Extract tweet URL
    const href = tweetEl.querySelector('a[href*="/status/"]').getAttribute('href')
    tweet.permalink = `https://twitter.com${href}`

    // Extract tweet timestamp
    tweet.time = tweetEl.querySelector('time').getAttribute('datetime')

    // Extract tweet text
    // NOTE: 'article div[lang]' doesn't always find an element because
    // some tweets don't have any textual data (eg, a tweet of only an image).
    // In these cases, the following line will throw an error. That's OK.
    const articleEl = tweetEl.querySelector('article div[lang]')
    tweet.textContent = articleEl.textContent

    // Extract links embedded in tweet text
    Array.from(articleEl.querySelectorAll('a[role="link"]'))
      .forEach(linkEl => {
        const link = {
          href: undefined,
          textContent: undefined
        }

        // Extract link href
        link.href = linkEl.getAttribute('href')

        if (/^\//.test(link.href)) {
          link.href = `https://twitter.com${link.href}`
        }

        // Extract link textContent. (Should this be innerText?)
        link.textContent = linkEl.textContent

        tweet.links.push(link)
      })

    return tweet
  }

  try {
    const tweets = []

    let scrollCount = 0
    let previousHeight = 0
    let currentHeight = document.scrollingElement.scrollHeight

    while (scrollCount < maxScrollCount && previousHeight < currentHeight) {
      // Scroll bookkeeping
      previousHeight = document.scrollingElement.scrollHeight

      // Get tweet elements from the DOM
      const tweetElements = document.querySelectorAll('[data-testid="tweet"]')

      // Transform tweet elements to some useful JSON
      for (const el of tweetElements) {
        try {
          const tweet = tweet2json(el)
          console.log(tweet)
          tweets.push(tweet)
        } catch (error) {
          console.error(error)
          // Don't re-throw. Just keep going.
        }
      }

      // Scroll some more...
      window.scrollBy(0, previousHeight)

      // Wait a bit for new stuff to load
      await sleep(5000)

      // More scroll bookkeeping
      currentHeight = document.scrollingElement.scrollHeight
      scrollCount += 1
    }

    return tweets
  } catch (error) {
    console.error(error)

    // re-throw
    throw error
  }
}

module.exports = captureTweets
