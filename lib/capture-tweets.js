// Capture tweets from the DOM as we scroll the page. We have to resort to this
// method of getting the tweets b/c twitter annoyingly modifies the DOM to
// insert/remove tweet elements as you scroll. Thus, you can't simply scroll the
// page a bunch and then invoke a single querySelectorAll to get all tweets.
// What a waste of compute resources.
const captureTweets = async (maxScrollCount = 3) => {
  // This function transforms an array of DOM elements containing tweets
  // into an array of usable JSON objects.
  const transformTweetElsToJSON = tweetEls => {
    return tweetEls.map(tweetEl => {
      const tweetObj = {}

      // TODO tweet url
      // tweetObj.url = tweetEl.querySelector(...).getAttribute(...)????

      // Extract tweet timestamp
      tweetObj.time = tweetEl.querySelector('time').getAttribute('datetime')

      // Extract tweet text
      const articleEl = tweetEl.querySelector('article div[lang]')
      tweetObj.textContent = articleEl.textContent

      // Extract links embedded in tweet text
      tweetObj.links = Array.from(articleEl.querySelectorAll('a[role="link"]'))
        .map(linkEl => {
          const linkObj = {}

          // Extract link href
          linkObj.href = linkEl.getAttribute('href')

          // Extract link textContent. (Should this be innerText?)
          linkObj.textContent = linkEl.textContent

          return linkObj
        })

      return tweetObj
    })
  }

  try {
    const tweetEls = []

    let scrollCount = 0
    let previousHeight = 0
    let currentHeight = document.scrollingElement.scrollHeight

    while (scrollCount < maxScrollCount && previousHeight < currentHeight) {
      // Scroll bookkeeping
      previousHeight = document.scrollingElement.scrollHeight

      // Save tweet elements as we scroll along.
      const moreTweetEls = document.querySelectorAll('[data-testid="tweet"]')
      tweetEls.push(...moreTweetEls)

      // Scroll some more...
      window.scrollBy(0, previousHeight)

      // Wait a bit for new stuff to load
      await new Promise((resolve) => { setTimeout(resolve, 3000) })

      // More scroll bookkeeping
      currentHeight = document.scrollingElement.scrollHeight
      scrollCount += 1
    }

    // Transform tweet elements to some useful JSON
    return transformTweetElsToJSON(tweetEls)
  } catch (err) {
    return err
  }
}

module.exports = captureTweets
