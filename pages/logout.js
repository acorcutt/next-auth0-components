import React from 'react';
import Router from 'next/router';

import Login from '../components/Login';

class LogoutPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    try{
      window.localStorage.removeItem('auth0AccessToken');          
      window.localStorage.removeItem('auth0IdToken');
      window.localStorage.removeItem('auth0Profile');
      
      // Redirect
      Router.push('/');
    }
    catch(err){
      console.log('No Local Storage');
    }    
  }

  render () {
    return <div>Logout...</div>;
  }
}

export default LogoutPage;