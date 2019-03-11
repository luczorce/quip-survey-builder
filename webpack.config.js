require('dotenv').config();

const path = require('path');
const cwd = process.cwd();

const ReplaceInFilePlugin = require('replace-in-file-webpack-plugin');
let config = require("quip-apps-webpack-config");
let key, route, directoryToTarget;

const isDevelopment = checkIfDevelopment();
const isDemoBuild = checkIfDemoBuild();
const isProductionBuild = checkIfProductionBuild();

// change secret values in generated app files
directoryToTarget = 'app/dist';
if (isDevelopment) {
  key = `${process.env.LOCAL_API_KEY}`;
  route = `${process.env.LOCAL_ROUTE}`;
} else if (isDemoBuild) {
  key = `${process.env.DEMO_API_KEY}`;
  route = `${process.env.DEMO_ROUTE}`;
  directoryToTarget = 'demo-app/dist';
} else if (isProductionBuild) {
  key = `${process.env.PROD_API_KEY}`;
  route = `${process.env.PROD_ROUTE}`;
}

const replacer = new ReplaceInFilePlugin([
  {
    dir: directoryToTarget,
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

if (isDemoBuild) {
  const differentOutput = {
    path: path.resolve(cwd, "./demo-app/dist"),
    filename: "app.js",
    publicPath: "dist"
  };
  
  config.output = differentOutput;
}

module.exports = config;

//////

function checkIfDevelopment() {
  return (process.env.NODE_ENV === 'development');
}

function checkIfDemoBuild() {
  return (process.env.NODE_ENV === 'production' && process.env.DEMO_APP === 'true');
}

function checkIfProductionBuild() {
  return (process.env.NODE_ENV === 'production')
}
