import Root from '../layouts/Root';
import Link from 'next/link';

import Lock from '../components/Lock';

export default () => {
  
  // Calculate options on the client from window location
  let options = () => ({
    auth: {
      redirectUrl: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + '/login',
      responseType: 'token'
    },
      // theme: {
      //   primaryColor: '#FF6300'
      // },    
  });
  
  return <Root className="mw7 center ph2">
    <h1 className="f1">Next Auth0 Components</h1>

    <Lock options={options} auth0Id={process.env.AUTH0_ID} auth0Domain={process.env.AUTH0_DOMAIN} layout={({lock})=>(<button onClick={()=>{lock.show()}}>Overlay Login</button>)}><Link href="/login"><a>Static Login Link</a></Link></Lock>
  
  </Root>;
};