export default {
  applyMiddleware(req, next) {

    if (!req.options.headers) {
      // Create the header object if needed.
      req.options.headers = {};  
    }

    // Get authentication token from local storage if it exists
    try{
      if (process.browser && window.localStorage && window.localStorage.getItem('auth0IdToken')) {
        req.options.headers.authorization = `Bearer ${window.localStorage.getItem('auth0IdToken')}`;
      }
    }
    catch(e){
      // We don't have localStorage access?
      console.log(e);
    }

    next();
  }
};