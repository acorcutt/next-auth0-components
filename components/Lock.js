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
    authenticated: PropTypes.func,
    error: PropTypes.func,
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
        primaryColor: '#FF6300'
      },
      ...this.props.options
    });
    
    this.props.authenticated && this.lock.on('authenticated', this.props.authenticated);
    this.props.error && this.lock.on('unrecoverable_error', this.props.error);
    
    Router.onRouteChangeStart = () => {
      this.lock && this.lock.hide();
    };

    this.props.ready && this.props.ready(this.lock);
  }

  componentWillUnmount () {
    this.lock && this.lock.hide();
  }

  onClick = (e) =>{
    e.preventDefault();
    try{
      window.localStorage.setItem('auth0Redirect', this.props.redirect);
    }
    catch(e){ // local storage is disabled just ignore
    }
    
    this.lock && this.lock.show();
  }

  render () {
    // Extract props we don't want to passthrough
    const { ready, options, login, redirect, auth0Id, auth0Domain, ...passThroughProps } = this.props;
    const { children } = this.props;
    
    if (typeof children === 'function') { // Custom children
      return children({
        lock: this.lock // Note that this may not be available!
      });
    } else { // Create a link with fallback
      return <a {...passThroughProps} href={ login + '?redirect=' + redirect } onClick={this.onClick} />;
    }
  }
}

Lock.defaultProps = {
  login: '/login',
  redirect: '/',
  options: {}
};

export default Lock;