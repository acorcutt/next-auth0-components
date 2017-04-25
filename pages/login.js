import React from 'react';

import Login from '../components/Login';

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
  }

  // Do something with the authResult and return a redirect url
  verify ( create, authResult, profile ){
    //console.log(authResult, profile);
    // If failed then call the create callback - else redirect
    create({
      name: profile.name,
      email: profile.email,
      username: profile.nickname
    });
  }
  
  // Create a user in the db and return
  create ( callback ) {
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

    return <Login options={options} verify={this.verify} create={this.create} url={url} auth0Id={process.env.AUTH0_ID} auth0Domain={process.env.AUTH0_DOMAIN} />;
  }
}

export default LoginPage;