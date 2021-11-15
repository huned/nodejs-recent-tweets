# Recent Tweets for Node.js

Main repo: [https://github.com/huned/nodejs-recent-tweets](https://github.com/huned/nodejs-recent-tweets)

A library and command line utility to get recent tweets for a given user.
Also extracts useful information: text, timestamp, permalink, and all links.

Why use it?

* anonymous: no API credentials needed
* returns an array of JSON objects with text, permalink, links, and timestamp
* optionally, automatically unshortens https://t.co shortlinks.
* includes a rad command line tool

**WARNING** v0.9.0 has breaking changes from prior releases (<= 0.0.5).

## Command Line Usage

    # first install the module globally
    $ npm install -g recent-tweets

    # then use the twls command
    $ twls earthquakessf | jq
    [
      {
        "time": "2021-11-15T18:27:01.000Z",
        "permalink": "https://twitter.com/earthquakesSF/status/1460313405609287682",
        "textContent": "A 1.7 magnitude earthquake occurred 8.08mi ESE of Angwin, CA. Details: http://eqbot.com/sPf Map:",
        "links": [
          {
            "href": "https://t.co/zwz71Ud5VG?amp=1",
            "textContent": "http://eqbot.com/sPf"
          }
        ]
      },
      {
        "time": "2021-11-14T07:24:01.000Z",
        "permalink": "https://twitter.com/earthquakesSF/status/1459784165889490944",
        "textContent": "A 1.7 magnitude earthquake occurred 4.35mi E of Penngrove, CA. Details: http://eqbot.com/sPY Map:",
        "links": [
          {
            "href": "https://t.co/Q7lR9coDQV?amp=1",
            "textContent": "http://eqbot.com/sPY"
          }
        ]
      },
      {
        "time": "2021-11-13T22:45:01.000Z",
        "permalink": "https://twitter.com/earthquakesSF/status/1459653555606802436",
        "textContent": "A 1.8 magnitude earthquake occurred 4.97mi WSW of Mountain House, CA. Details: http://eqbot.com/sPV Map:",
        "links": [
          {
            "href": "https://t.co/MM5tilm59a?amp=1",
            "textContent": "http://eqbot.com/sPV"
          }
        ]
      },
      ...
    ]

  See [`man twls`](./man/doc.1) for more.

## Node.js Usage

    # Install the module
    npm install recent-tweets --save

    # In your code
    const getTweets = require('recent-tweets')
    const tweets = await getRecentTweets('earthquakessf')

## Caveats

* Expanding shortlinks: one additional network request per shortlink, so can
  be slow.

## TODOs

- [ ] throw an error when puppeteer receives a 4xx response

## Author

[Huned Botee](https://github.com/huned)

## License

MIT
