// Temporary fix for next 2.3
// https://github.com/zeit/next.js/issues/1877#issuecomment-299396974
const webpack = require('webpack');

module.exports = {
  webpack: (config) => {
    if (config.resolve && config.resolve.alias) {
      delete config.resolve.alias['react'];
      delete config.resolve.alias['react-dom'];
    }
    return config;
  }
};