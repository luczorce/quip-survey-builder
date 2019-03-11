# Quip Survey Builder

_This is an app to create surveys inside Quip, then distribute them to fellow Quip users and collect their answers._

## Local Development

Follow the instructions on deploying your [first quip app](https://salesforce.quip.com/dev/liveapps/). There will be some differences, though.

### Setup

You'll only need to run this once.

1. Create a `.env` file, which contains the following key/value pairs:
   * `LOCAL_API_KEY` allows us to communicate with our local api for development
   * `LOCAL_ROUTE` route to the local api for development
   * `PROD_API_KEY` used for the `npm run build` command
   * `PROD_ROUTE` used for the `npm run build` command
   * `DEMO_API_KEY` used for the `npm run build-demo` command
   * `DEMO_ROUTE` used for the `npm run build-demo` command
2. `npm run prepssl` and feel free to leave answers blank... we're setting up keys to use to serve this live app with ssl

### Starting 

These commands you'll run everytime you start any development task locally.

1. `npm run watch` to start webpack watching and rebuilding the liveapp as we go
2. `npm run serve` in another terminal window to serve the contents from files (as oppposed to from memory, which webpack-dev-sever does)
   * **why, tho?**
   * in order to protect the api key, we want to store it in an environment variable
   * in order to use that environment variable, we replace a special, cheeky string on compilation so our client code can access it's value
   * this happens to files, but not to the compiled code _in memory_, so we were unable to use the special value with webpack-dev-server

## Building and Deploying

When we want to deploy our live app for people to use, we run the following two commands:

``` bash
npm run build
npm run build-demo
```

In both `./app` and `./demo-app` folders you'll have an `app.ele` (or `demo-app.ele`) file that you can upload to the Quip Dev Console. We build two of these apps because we are separating demo environments to share with the larger community from those surveys which will be used more seriously.

## Helpful Links

* [quip app reference](https://salesforce.quip.com/dev/liveapps/documentation)
* [quip app common themes](https://salesforce.quip.com/dev/liveapps/recipes)
* [starting your first quip app](https://salesforce.quip.com/dev/liveapps/)
