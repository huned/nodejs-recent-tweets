# Recent Tweets for node.js

Main repo: [https://github.com/huned/nodejs-recent-tweets](https://github.com/huned/nodejs-recent-tweets)

A function and command line utility to get recent tweets for a specific user.
Also extracts useful information: text, timestamp, and all links.

Why use it?

* it's just one simple function
* includes a command line tool for unix composability
* anonymous: no API credentials needed
* returns a JSON object with html, text, links, and timestamp

## Installation

    npm install recent-tweets

## Usage

    # Get recent tweets for https://twitter.com/huned
    const getRecentTweets = require('recent-tweets')
    const tweets = await getRecentTweets('huned')

## Command Line

Use the command line tool if you want to pipe the JSON output to another
command. E.g.

    TWITTER_USERNAME=huned npm start | mail -s 'Recent Tweets' you@example.com

If you prefer, set environment variables in `.env` instead of specifying at the
command line.

Other environment variables you can define:

* `HTTP_USER_AGENT`: specify user agent to use when fetching tweets

## Author

[Huned Botee](https://github.com/huned)

## License

MIT
