import { createNetworkInterface } from 'react-apollo';

import nextApolloProvider from 'next-apollo-provider';

import authMiddleware from './authMiddleware';

export default nextApolloProvider((initialState, ssrMode, context)=>{
  //console.log('process.env.GRAPHQL_URL',process.env.GRAPHQL_URL);
  const networkInterface = createNetworkInterface({
    uri: process.env.GRAPHQL_URL,
    opts: {
      credentials: 'same-origin'  
    }
  });
  
  networkInterface.use([authMiddleware]);
  
  const clientSettings = {
    initialState,
    ssrMode,
    connectToDevTools: (process.browser && process.env.NODE_ENV !== 'production'),
    dataIdFromObject: (result) => (result.id || null),
    networkInterface: networkInterface
  };
  
  return clientSettings;
  
});
