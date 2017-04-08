# Next Boilerplate

Boilerplate for rapidly prototyping apps and components with next.js, react, express, pm2, tachyons.

## Quickstart

`git clone git@github.com:acorcutt/boilerplate.git`

`git remote rename origin upstream` or `git remote rm origin`

`git remote add origin your-repos-url`

## App Boilerplate

Custom next.js server routing in `app.js` pm2 cluster setup in `server.js` module export if required in `index.js`.

### Run app as single instance
`node app.js`

### Run in a PM2 cluster
`node server.js`

### Build
`next build`