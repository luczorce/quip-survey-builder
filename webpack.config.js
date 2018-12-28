require('dotenv').config();

const ReplaceInFilePlugin = require('replace-in-file-webpack-plugin');
let config = require("quip-apps-webpack-config");

const replacer = new ReplaceInFilePlugin([{
  dir: 'app/dist',
  files: ['app.js'],
  rules: [{
    search: '%%api_secret%%',
    replace: `${process.env.API_KEY}`
  }]
}]);
config.plugins.push(replacer);

module.exports = config;
