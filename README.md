# Recent Tweets for node.js

Main repo: [https://github.com/huned/nodejs-recent-tweets](https://github.com/huned/nodejs-recent-tweets)

A library and command line utility to get recent tweets for a given user.
Also extracts useful information: text, timestamp, permalink, and all links.

Why use it?

* anonymous: no API credentials needed
* returns an array of JSON objects with text, permalink, links, and timestamp
* includes a command line tool for unix composability

## Installation

    npm install recent-tweets

    # or npm install -g recent-tweets

## Command Line

Use the command line tool if you want to pipe the JSON output to another
command. E.g.

    TWITTER_USERNAME=huned npm start --silent | mail -s 'Recent Tweets' you@example.com

## Node.js Usage

    # Get recent tweets for https://twitter.com/huned
    const getRecentTweets = require('recent-tweets... lstweets? lstw? twls?')
    const tweets = await getRecentTweets('huned')

## TODOs

- [ ] Fix tests
- [ ] Update package versions
- [ ] CLI improvements
    - [ ] use meow for actual argument parsing
    - [ ] Set `bin` in package.json (better name?)
    - [ ] man page
- [ ] update README
- [ ] bump version, git tag, npm publish
- [ ] ?ESM-ify?

## Author

[Huned Botee](https://github.com/huned)

## License

MIT
