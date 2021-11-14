const getRecentTweets = require('./lib/recent_tweets')
const debug = require('debug')('recent-tweets')

if (require.main === module) {
  const twitterUsername = process.env.TWITTER_USERNAME
  debug(`getting recent tweets for ${twitterUsername}`)
  getRecentTweets(twitterUsername)
    .then(tweets => {
      process.stdout.write(JSON.stringify(tweets))
      process.stdout.write('\n')
    })
} else {
  debug('required as a module')
}

module.exports = getRecentTweets
