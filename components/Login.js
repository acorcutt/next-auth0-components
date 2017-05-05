import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import PropTypes from 'prop-types';
import defaultsDeep from 'lodash/defaultsDeep';

import Lock from './Lock';
import Layout from './Layout';
import Form from './Form';

const defaultOptions = {  
  languageDictionary: {
    title: 'Auth 0'
  },    
  theme: {
    primaryColor: '#FF6300',
    logo: '//cdn.auth0.com/styleguide/1.0.0/img/badge.png'
  }
};

// The login page will either show a login form or handle the login and user creation process when returning from auth
class Login extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      action: null, // action from url 
      user: null,  // create user data
      authResult: null, // auth tokens etc.
      error: null // user create error
    };
  }

  static propTypes = {
    auth0Id: PropTypes.string.isRequired,
    auth0Domain: PropTypes.string.isRequired,
    options: PropTypes.object, // lock options
    onAuthenticated: PropTypes.func, // function to verify authenticated user
    onCreate: PropTypes.func, // function to create a new user
  }

  // We need to wait for a lock to be available before we do anything
  onLock = (component) => {
    
    this.lock = component && component.lock;
    
    if(this.lock){
      // Set action from url, default to 'login'
      this.setState({ action: Router.query.action || 'login' });        
    } else {
      // Something went wrong
      this.setState({ action: 'error' });  
    }

    // Listen for route changes
    Router.onRouteChangeStart = (url) => { // onRouteChangeComplete
      component && component.lock && this.setState({ action: Router.query.action || 'login' });        
    };
  }

  // We should always get a componentDidUpdate as the lock will trigger a state change when its ready.
  componentDidUpdate(prevProps, prevState) {
    if(!this.lock){
      return;
    }
    if(window.location.hash){
      // We are returning from auth, it will handle onAuth event
      return;
    }
    
    if(this.state.action === 'create' && !this.state.user){
      // If we are doing a create check we are logged in by looking at the user that was set.
      Router.push({ pathname:Router.pathname, query: { action:'login' } });
    }
    
    if(this.state.action !== prevState.action){
      switch(this.state.action){
        case 'create':
          // don't open on create
          break;
        case 'verify':
          this.lock.show({
            initialScreen: 'login',
            flashMessage: {
              type: 'error',
              text: 'Check the account credentials that you created your profile with are correct or login with a different account.'
            }
          }); 
          break;
        case 'password':
          this.lock.show({
            initialScreen: 'forgotPassword'
          });
          break;
        case 'signup':
          this.lock.show({
            initialScreen: 'signUp'
          });   
          break;
        default:
          this.lock.show({
            initialScreen: 'login'
          });
      }
    }
  }  

  onAuthenticated = (authResult) =>{
    this.lock && this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      //console.log('authenticated',authResult, profile, error);
      
      if (error) {
        this.lock && this.lock.show({
          flashMessage: {
            type: 'error',
            text: 'Invalid Token'
          }
        });         
      } else {
        
        if(this.props.onAuthenticated){
          this.props.onAuthenticated( authResult, profile, (user, err)=>{
            if(err){
              this.lock && this.lock.show({
                flashMessage: {
                  type: 'error',
                  text: err.message || 'There was an unknown error!'
                }
              });                 
            } else {
              // If onAuthenticated returns a user then set default state for form and redirect to create
              this.setState({ user, authResult, profile }, ()=>{
                Router.push({ pathname:Router.pathname, query: { action:'create' } });
              });
            }
          });
        } else {
          // Just redirect
          Router.push('/');
        }
      }
    });
  }

  onError = (error) =>{
    //console.log('auth error', error);

    this.lock && this.lock.show({
      flashMessage: {
        type: 'error',
        text: 'There was an error, please try again.'
      }
    });
  }
  
  onFormChange = (event) =>{
    this.setState({user:{
      ...this.state.user,
      [event.target.name]: event.target.value
    }});
  }
  
  onFormSubmit = (event) =>{
    event.preventDefault();
    this.props.onCreate && this.props.onCreate( this.state.user, this.state.authResult, ( error )=>{
      if(error){
        this.setState({ error });  
      } else {
        Router.push('/');
      }
    });
  }
  
  layout = ({ lock }) => {
    const { action, user, error } = this.state;
    const { options } = this.props;

    switch(action){
      case 'create':
        if(user){
          return <Layout><Head><title>Create</title></Head><Form options={defaultsDeep(options, defaultOptions )} user={user} error={error} onChange={this.onFormChange} onSubmit={this.onFormSubmit} /></Layout>;
        } else {
          return <Layout><Head><title>Authenticating...</title></Head></Layout>;
        }
      case 'password':
        return <Layout><Head><title>Change Password</title></Head></Layout>;  
      case 'verify':
        return <Layout><Head><title>Verify Credentials</title></Head></Layout>;  
      case 'error':
        return <Layout><Head><title>Error</title></Head></Layout>;
      default:
        return <Layout><Head><title>Login</title></Head></Layout>;
    }
  }

  render () {
    const { auth0Id, auth0Domain, options } = this.props;

    return <Lock ref={this.onLock} onError={this.onError} onAuthenticated={this.onAuthenticated} options={{...defaultsDeep(options, defaultOptions ), closable: false, autoclose: false }} layout={this.layout} auth0Id={auth0Id} auth0Domain={auth0Domain}>
      <Layout><Head><title>Initialising...</title></Head></Layout>
    </Lock>;
    
  }
}

Login.defaultProps = {
  options: {}
};

export default Login;