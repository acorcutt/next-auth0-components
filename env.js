// This sets variables we want available in client and server env, to be transformed by babel replace
// Restart server after modification
// via https://github.com/zeit/next.js/tree/master/examples/with-universal-configuration
module.exports = {
  "process.env.NODE_ENV": process.env.NODE_ENV,
  "process.env.AUTH0_ID": process.env.AUTH0_ID,
  "process.env.AUTH0_DOMAIN": process.env.AUTH0_DOMAIN,
  "process.env.GRAPHQL_URL": process.env.GRAPHQL_URL,
};