import Root from '../layouts/Root';

import Lock from '../components/Lock';

export default () => (<Root className="mw7 center ph2">
  <h1 className="f-headline">Next Auth0 Components</h1>
  <Lock ready={(lock)=>{console.log(lock);}}>Login</Lock>
</Root>);