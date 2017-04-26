import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash/defaultsDeep';

import Lock from './Lock';

const defaultOptions = {  
  languageDictionary: {
    title: 'Auth 0'
  },    
  theme: {
    primaryColor: '#FF6300',
    logo: '//cdn.auth0.com/styleguide/1.0.0/img/badge.png'
  }
};

function Layout({children}){
  return <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  
      <title>{defaultOptions.languageDictionary.title}</title>

      {/* //global jsx does not work inside the Head with initialState check? Just use standard style tag */}
      <style dangerouslySetInnerHTML={{__html: `html{background:#111118;} body{margin:0;padding:0;} body, input, select, option, textarea {font-family: sans-serif;}` }} />
      <noscript><style type="text/css">{`.js{display:none!important;}`}</style></noscript>
  
      <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
    </Head>  
    {children}
  </div>;
}


function Form(props){

  const options = defaultsDeep( props.options, defaultOptions );

  // Reuse the auth0 css to build a form to create a user
  return <div className="auth0-lock auth0-lock-opened">
    <Head><title>{options.languageDictionary.title}</title></Head>
    <div className="auth0-lock-overlay" />
    <div className="auth0-lock-center">
      <form className="auth0-lock-widget">
        <div className="auth0-lock-widget-container">
          <div className="auth0-lock-cred-pane auth0-lock-quiet">
            <div className="auth0-lock-header">
              <div className="auth0-lock-header-bg auth0-lock-blur-support">
                <div className="auth0-lock-header-bg-blur" style={{ backgroundImage: `url('${options.theme.logo}')`}}></div>
                <div className="auth0-lock-header-bg-solid" style={{ backgroundColor: options.theme.primaryColor}}></div>
              </div>
              <div className="auth0-lock-header-welcome"><img className="auth0-lock-header-logo" src={options.theme.logo} />
                <div className="auth0-lock-name">{options.languageDictionary.title}</div>
              </div>
            </div>
            <div className="auth0-lock-view-content">
              <div className="auth0-lock-body-content">
                <div className="auth0-lock-content">
                  <div className="auth0-lock-form">
                    <p><span>Hello, it looks like you are new here...</span></p>
                    
                    <p className="auth0-lock-alternative">
                      <a href="?verify" className="auth0-lock-alternative-link">Already have a profile?</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button className="auth0-lock-submit" type="button" style={{backgroundColor: options.theme.primaryColor}}>
              <span className="auth0-label-submit">
                Create Profile
                <span><svg focusable="false" className="icon-text" width="8px" height="12px" viewBox="0 0 8 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="Web/Submit/Active" transform="translate(-148.000000, -32.000000)" fill="#FFFFFF"><polygon id="Shape" points="148 33.4 149.4 32 155.4 38 149.4 44 148 42.6 152.6 38"></polygon></g></g></svg></span>
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>;  
}

      // <form className="auth0-lock-widget">
      //   <div className="auth0-lock-cred-pane">
      //     <div className="auth0-lock-content">
      //       <div><p><span>Hello, it looks like you are new here...</span></p></div>
      //       <input type="email" name="email" placeholder="Contact Email" />
      //       <input type="text" name="name" placeholder="Display Name" />
      //       <input type="text" name="username" placeholder="Username" />
      //     </div>
      //     <button className="auth0-lock-submit" type="button">Create Account</button>
      //   </div>
      // </form>

// The login page will either show a login form or handle the login and user creation process when returning from auth
class Login extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      lock: null, // we have to wait for the lock to be initialised
      user: null  // create user data
    };
  }

  static propTypes = {
    auth0Id: PropTypes.string.isRequired,
    auth0Domain: PropTypes.string.isRequired,
    login: PropTypes.string, // login path for auth0 to return to
    options: PropTypes.object, // lock options
    onAuthenticated: PropTypes.func, // function to verify authenticated user
    //create: PropTypes.func, // function to create a new user
  }
  
  componentDidUpdate(prevProps, prevState) {
    // We should always get a componentDidUpdate as the lock will trigger a state change when its ready.

    // If we are not doing create and we have a new lock then open it for login
    // Note that the return from auth0 with #hash will hit this also. Lock will authenticate and redirect to verify action
    if(!this.state.user && !window.location.hash && this.state.lock && !prevState.lock){
      // TODO - we do a page load in the form to '?verify' - should we just trigger a state change to get here instead?
      if(window.location.search === '?verify'){
        // Let the user check they used the correct account (they might have use social before etc.)
        this.state.lock.show({
          flashMessage: {
            type: 'error',
            text: 'Check the account credentials that you created your profile with are correct'
          }
        });  
      } else{
        this.state.lock.show();  
      }
    } else {
      // we have some user data to create a new user
    }

  }  

  onAuthenticated = (authResult) =>{
    
    this.state.lock && this.state.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      //console.log('authenticated',authResult, profile, error);
      
      if (error) {
        this.state.lock && this.state.lock.show({
          flashMessage: {
            type: 'error',
            text: 'Invalid Token'
          }
        });         
      } else {
        
        if(this.props.onAuthenticated){
          this.props.onAuthenticated((user)=>{
            // If verify returns then set default user state for form
            this.setState({ user });
            //Router.replace(this.props.login + '?action=create');  
          }, authResult, profile );
        } else {
          // Just redirect
          Router.replace('/');
        }
      }
    });
  }

  onError = (error) =>{
    //console.log('auth error', error);

    this.state.lock && this.state.lock.show({
      flashMessage: {
        type: 'error',
        text: 'There was an error, please try again.'
      }
    });
  }
  
  layout = ({ lock }) => {
    const { user } = this.state;
    const { options } = this.props;
    
    if( user ){
      return <Layout><Form options={options} /></Layout>;
    } else {
      return <Layout><Head><title>Login</title></Head></Layout>;
    }
  }

  onLock = (component) => {
    this.setState({lock: component.lock});
  }

  render () {
    const { auth0Id, auth0Domain, options } = this.props;

    //return <Lock ref={this.onLock} onError={this.onError} onAuthenticated={this.onAuthenticated} options={{...defaultsDeep(options, defaultOptions ), closable: false, autoclose: false }} children={(props)=>(<Layout>{this.layout(props)}</Layout>)} auth0Id={auth0Id} auth0Domain={auth0Domain} />;
    return <Lock ref={this.onLock} onError={this.onError} onAuthenticated={this.onAuthenticated} options={{...defaultsDeep(options, defaultOptions ), closable: false, autoclose: false }} layout={this.layout} auth0Id={auth0Id} auth0Domain={auth0Domain}>
      <Layout><Head><title>Initialising...</title></Head></Layout>
    </Lock>;
    
  }
}

Login.defaultProps = {
  login: '/login',
  options: {}
};

export default Login;