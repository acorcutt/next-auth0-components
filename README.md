# Next Auth0 Components

Components for quickly adding Auth0 support to a Next.js app.

## TODO
- Logout page
- Authentication helpers
- Multiple account connecting
- Custom profile form

## Usage

Setup a client in Auth0 and allow the `https://yourdomain.com/login` and `https://yourdomain.com/logout` callback Urls.

Set `process.env.AUTH0_ID` and `process.env.AUTH0_DOMAIN` to your client 

### Minimal Setup

Create a `pages/login.js` page and render the `<Login auth0Id={process.env.AUTH0_ID} auth0Domain={process.env.AUTH0_DOMAIN} />` component. 

### Intercept authentication to verify or create a user in your database.

Provide an `onAuthenticated( authResult, profile, callback )` function to intercept the authentication response and verify email, create a user in your database etc.

```
onAuthenticated = ( authResult, profile, callback ) => {
  if(ok){
    // set local storage etc and redirect...
    Router.push('/');
  } else {
    //
    if(error){
      callback(null, error);
    } else {
      // initalize create step with a user
      callback({name: profile.name});
    }
  }
}
```

### Add onCreate to create a user

```
onCreate = ( user, authResult, callback ){
  // create in db or error from profile info
  createUserMutation(user).then(()=>{
    Router.push('/');    
  }).catch(error => callback( error );)
}
```


### Using Lock Overlay

Use the `<Lock />` component on a page to generate an overlay login form...

```
import Lock from 'next-auth0-components';

<Lock layout={({lock})=>(<button onClick={()=>{lock.show()}}>Overlay Login</button>)} auth0Id={process.env.AUTH0_ID} auth0Domain={process.env.AUTH0_DOMAIN}><a href="/login">Static Login Link</a></Lock>
```

## App Boilerplate & Example

Custom next.js server routing in `app.js` pm2 cluster setup in `server.js` module export in `index.js`.

### Run app as single instance
`node app.js`

### Run in a PM2 cluster
`node server.js`

### Build
`next build`