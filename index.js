#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const getTweets = require('./lib/recent_tweets')
const debug = require('debug')('recent-tweets')

if (require.main === module) {
  const options = commandLineArgs([
    { name: 'username', alias: 'u', type: String, defaultOption: true },
    { name: 'expand-shortlinks', alias: 'x', type: Boolean, defaultValue: false },
    { name: 'device', alias: 'd', type: String, defaultValue: 'iPhone 11 Pro Max' }
  ])

  if (!options.username) {
    throw new Error('Provide a username')
    // TODO show help message and set process.exitCode
  }

  debug(`options: ${JSON.stringify(options, null, 2)}`)

  debug(`getting recent tweets for ${options.username}`)
  getTweets(options.username, {
    expandShortlinks: options['expand-shortlinks'],
    deviceDescriptor: options.device
  }).then(tweets => {
    process.stdout.write(JSON.stringify(tweets))
    process.stdout.write('\n')
  })
} else {
  debug('required as a module')
}

module.exports = getTweets
