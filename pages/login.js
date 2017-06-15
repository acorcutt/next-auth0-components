import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import Router from 'next/router';

import withApollo from '../lib/withApollo';
import Login from '../components/Login';



class LoginPage extends React.Component {

  constructor(props) {
    super(props);
  }

  // Do something with the authResult - use the callback to continue to create user or throw error
  onAuthenticated = ( authResult, profile, callback ) => {
    //console.log(authResult, profile);
    
    // Do checks such as email validation, account suspeneded etc.
    if(!profile.email_verified){
      let err = {
        message: 'Please check your email and validate your email address.'
      };
      callback(null, err);
    } else {
      // Check we have a user in the db
      this.props.apolloClient.query({
        query: userQuery,
        variables: {
          auth0UserId: profile.user_id
        }
      }).then((query)=>{
        if(query.data && query.data.User){
          // We have a user, just save the auth token and redirect
          try{
            window.localStorage.setItem('auth0AccessToken', authResult.accessToken);          
            window.localStorage.setItem('auth0IdToken', authResult.idToken);
            window.localStorage.setItem('auth0Profile', JSON.stringify(profile));
            
            // Redirect
            Router.push('/');
          }
          catch(err){
            callback(null, { message: 'You must allow your browser to use local storage to login.'});            
          }          
          
        } else {
          // We dont have a user so pass the profile data to the callback to initiate create
          // You could create a user in the db here to skip the create step
          callback({
            name: profile.name.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()),  // ensure name is not an email address and capitalize
            email: profile.email,
            username: profile.nickname,
            picture: profile.picture
          });        
        }
      }).catch((err)=>{
        callback(null, err);
      });
    }
  }
  
  // Create a user in the db and return
  onCreate = ( user, authResult, callback ) => {
    console.log('onCreate', user, authResult);
    
    this.props.createUserMutation({ variables: {
      username: user.username,
      name: user.name,
      email: user.email,
      picture: user.picture,
      authProvider: { auth0: { idToken: authResult.idToken} }
    }}).then((result) => {
      Router.replace(window.localStorage.getItem('auth0Redirect') || '/');      
    }).catch( (errors)=>{
      console.log('mutationError', errors);
      let error = new Error();
      
      if(errors.graphQLErrors && errors.graphQLErrors.length > 0){
        for (let gqlError of errors.graphQLErrors) {
          if(gqlError.message.includes('User already exist')) {
            error.message = 'User already exists!';
          } else {
            error.message = 'There was an error, please check details and try again.';
          }
        }          
      } else {
        error.message = 'There was an unknown error, please check details and try again.';
      }

      callback( error );
    }); 
  }

  render () {
    
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

const userQuery = gql`
  query($auth0UserId: String!) {
    User(auth0UserId:$auth0UserId){
      id
      name
    }
  }
`;

const createUserMutation = gql`
  mutation ($username: String!, $email: String!, $picture: String!, $name: String!, $authProvider: AuthProviderSignupData!) {
    createUser(username: $username, email: $email, picture: $picture, name: $name, authProvider: $authProvider) {
      # We are not authenticated yet so can only get public fields on this request!
      id
      name
      username
      picture
    }
  }
`;

export default compose(
  withApollo,
  graphql(createUserMutation, { name: 'createUserMutation' })
)(LoginPage);