# Next Auth0 Components

__Work in Progress__

Components for quickly adding Auth0 support to a Next.js app.

## TODO
- Account creation callback
- Fix redirect
- Logout page
- Authentication helpers
- Multiple account connecting

## Usage

Setup a client in Auth0 and allow the `https://yourdomain.com/login` and `https://yourdomain.com/logout` callback Urls.

Set `process.env.AUTH0_ID` and `` to your client 

### Minimal Setup

Create a `pages/login.js` page and render the `<Login auth0Id={process.env.AUTH0_ID} auth0Domain={process.env.AUTH0_DOMAIN} />` component. 

### Intercept authentication to verify or create a user in your database.

Provide a `onAuthenticated()` function to intercept the authentication response to create a user in your database, set `localStorage` or redirect if required.

### Intercept authentication and create a user profile

TODO

### Using Lock Overlay

TODO

## App Boilerplate & Example

Custom next.js server routing in `app.js` pm2 cluster setup in `server.js` module export in `index.js`.

### Run app as single instance
`node app.js`

### Run in a PM2 cluster
`node server.js`

### Build
`next build`