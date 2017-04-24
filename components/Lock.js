import React from 'react';
import Router from 'next/router';
import Auth0Lock from 'auth0-lock';
import PropTypes from 'prop-types';

// Use as simple link wrapper
// <Lock redirect="/here">A link</Lock>
// Custom usage
// <Lock redirect="/here" children={({show, hide})=>(<a onClick={show} href="/login">My Login</a>)} />
// <Lock ready={(lock)=>{lock.show()}} />
class Lock extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    auth0Id: PropTypes.string.isRequired,
    auth0Domain: PropTypes.string.isRequired,
    login: PropTypes.string,
    redirect: PropTypes.string,
    options: PropTypes.object,
    ready: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }

  componentDidMount () {
    // Cross-browser window.origin
    let origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');

    // Configure Auth0 instance
    this.lock = this.lock || new Auth0Lock(this.props.auth0Id, this.props.auth0Domain, {
      auth: {
        redirectUrl: origin + this.props.login,
        responseType: 'token'
      },
      theme: {
        primaryColor: '#5E2CA5'
      },
      ...this.props.options
    });
    
    this.lock.on('authenticated', this.onAuthenticated);
    this.lock.on('unrecoverable_error', this.onError);
    
    Router.onRouteChangeStart = () => {
      this.lock && this.lock.hide();
    };

    this.props.ready && this.props.ready(this);
  }

  componentWillUnmount () {
    this.lock && this.lock.hide();
  }

  onAuthenticated = (authResult) =>{
    //console.log('authenticated',authResult);
    try{
      window.localStorage.setItem('auth0IdToken', authResult.idToken);
    }
    catch(e){
      this.lock && this.lock.show({
        flashMessage: {
          type: 'error',
          text: 'You must allow your browser to use local storage to login.'
        }
      });      
    }
    
    // Redirect to verify or create user
    Router.replace(this.props.login + '?verify');
  }

  onError = (error) =>{
    //console.log('auth error', error);
    
    //window.localStorage.removeItem('auth0IdToken');
    //window.localStorage.removeItem('auth0Redirect');
    
    this.lock && this.lock.show({
      flashMessage: {
        type: 'error',
        text: 'There was an error, please try again.'
      }
    });
  }

  show = () => {
    const { redirect } = this.props;
    
    try{
      window.localStorage.setItem('auth0Redirect', redirect);
      this.lock && this.lock.show();
    }
    catch(e){
      this.lock && this.lock.show({
        flashMessage: {
          type: 'error',
          text: 'You must allow your browser to use local storage to login.'
        }
      });      
    }
    
  }

  hide = () => {
    this.lock && this.lock.hide();    
  }

  onClick = (e) =>{
    e.preventDefault();
    this.show();
  }

  render () {
    // Extract props we don't want to passthrough
    const { ready, login, redirect, auth0Id, auth0Domain, ...passThroughProps } = this.props;
    const { children } = this.props;
    
    if (typeof children === 'function') { // Custom children
      return children({
        show: this.show,
        hide: this.hide
      });
    } else { // Create a link with fallback
      return <a {...passThroughProps} href={login} onClick={this.onClick} />;
    }
  }
}

Lock.defaultProps = {
  login: '/login',
  redirect: '/'
};

export default Lock;