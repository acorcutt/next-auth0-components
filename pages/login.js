import React from 'react';

import Login from '../components/Login';

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
  }

  // Do something with the authResult and return a redirect url
  onAuthenticated ( create, authResult, profile ){
    //console.log(authResult, profile);
    // If failed then call the create callback - else redirect
    create({
      name: profile.name,
      email: profile.email,
      username: profile.nickname
    });
    
        // try{
        //   window.localStorage.setItem("auth0AccessToken", authResult.accessToken);          
        //   window.localStorage.setItem('auth0IdToken', authResult.idToken);
        //   window.localStorage.setItem("auth0Profile", JSON.stringify(profile));
          
        //   // Redirect to verify or create user
        //   Router.replace(this.props.login + '?action=verify');
          
        // }
        // catch(e){
        //   this.state.lock && this.state.lock.show({
        //     flashMessage: {
        //       type: 'error',
        //       text: 'You must allow your browser to use local storage to login.'
        //     }
        //   });      
        // }
    
  }
  
  // Create a user in the db and return
  onCreate ( callback ) {
    let user = {

    }
    let err = null;
    
    callback( user, err);
  }

  render () {
    const { url } = this.props;
    
    const options = {  
      languageDictionary: {
        title: 'My Site'
      },    
      theme: {
        primaryColor: '#FF0000',
      }
    };

    return <Login options={options} onAuthenticated={this.onAuthenticated} onCreate={this.onCreate} auth0Id={process.env.AUTH0_ID} auth0Domain={process.env.AUTH0_DOMAIN} />;
  }
}

export default LoginPage;