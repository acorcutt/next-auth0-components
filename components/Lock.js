import React from 'react';
import Router from 'next/router';
import Auth0Lock from 'auth0-lock';
import PropTypes from 'prop-types';

// Use as simple link wrapper, show a static link or an overlay when lock is ready...
// <Lock layout={({lock})=>(<button onClick={()=>{lock.show()}}>Overlay Login</button>)} auth0Id={process.env.AUTH0_ID} auth0Domain={process.env.AUTH0_DOMAIN}><a href="/login">Static Login Link</a></Lock>
class Lock extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      isMounted: false
    };
  }

  static propTypes = {
    auth0Id: PropTypes.string.isRequired,
    auth0Domain: PropTypes.string.isRequired,
    onAuthenticated: PropTypes.func,
    onError: PropTypes.func,
    layout: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    options: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func
    ])    
  }

  componentDidMount () {
    const { options, auth0Id, auth0Domain } = this.props;

    // Configure Auth0 instance - allow options to be a function returning options for client-side generation
    this.lock = this.lock || new Auth0Lock(auth0Id, auth0Domain, typeof options === 'function' ? options() : options);
    
    this.lock.on('authenticated', (...args)=>{
      this.props.onAuthenticated && this.props.onAuthenticated(...args);
    });
    
    this.lock.on('unrecoverable_error', (...args)=>{
      this.props.onError && this.props.onError(...args);
    });

    Router.onRouteChangeStart = () => {
      this.lock && this.lock.hide();
    };

    this.setState({ isMounted: true });
  }

  componentWillUnmount () {
    this.lock && this.lock.hide();
  }

  render () {
    const { children, layout } = this.props;
    console.log(layout, children)
    // Render optional layout when ready - with lock if function
    return this.state.isMounted ? (layout ? (typeof layout === 'function' ? layout({lock: this.lock}) : layout) : children ) : children;
  }
}

Lock.defaultProps = {
  options: {}
};

export default Lock;