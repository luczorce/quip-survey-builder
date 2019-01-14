require('dotenv').config();

const ReplaceInFilePlugin = require('replace-in-file-webpack-plugin');
let config = require("quip-apps-webpack-config");
let key, route;

if (process.env.NODE_ENV === 'development') {
  key = `${process.env.LOCAL_API_KEY}`;
  route = `${process.env.LOCAL_ROUTE}`;
} else if (process.env.NODE_ENV === 'production') {
  key = `${process.env.PROD_API_KEY}`;
  route = `${process.env.PROD_ROUTE}`;
}

const replacer = new ReplaceInFilePlugin([
  {
    dir: 'app/dist',
    files: ['app.js'],
    rules: [
      {
        search: '%%api_secret%%',
        replace: key
      },
      {
        search: '%%api_route%%',
        replace: route
      }
    ]
  }
]);
config.plugins.push(replacer);

module.exports = config;
