#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const getTweets = require('./lib/get_tweets.js')
const debug = require('debug')('recent-tweets')
const readline = require('readline')

const showUsage = () => {
  const message = 'twls [options...] twitter_username'
  process.stdout.write(message)
  process.stdout.write('\n')
}

const main = async options => {
  try {
    debug(`getting recent tweets for ${options.username}`)
    const tweets = await getTweets(options.username, {
      expandShortlinks: options['expand-shortlinks'],
      deviceDescriptor: options.device
    })

    process.stdout.write(JSON.stringify(tweets))
    process.stdout.write('\n')
  } catch (error) {
    console.error(error)
  }
}

if (require.main === module) {
  let options

  try {
    options = commandLineArgs([
      { name: 'username', alias: 'u', type: String, defaultOption: true },
      { name: 'expand-shortlinks', alias: 'x', type: Boolean, defaultValue: false },
      { name: 'device', alias: 'd', type: String, defaultValue: 'iPhone 11 Pro Max' }
    ])

    debug(`options: ${JSON.stringify(options, null, 2)}`)
  } catch (error) {
    options = undefined
    process.exitCode = -2
    showUsage()
  }

  if (options) {
    if (!options.username) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      rl.on('line', async username => {
        options.username = username
        main(options)
      })
    } else {
      main(options)
    }
  }
} else {
  debug('required as a module')
}

module.exports = getTweets
