import Link from 'next/link';

function Form({ user, options, onChange, onSubmit, error}){

  // Reuse the auth0 css to build a form to create a user
  return <div className="auth0-lock auth0-lock-opened">
    <div className="auth0-lock-overlay" />
    <div className="auth0-lock-center">
      <form className="auth0-lock-widget" onSubmit={onSubmit}>
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
            {error && <div className="auth0-global-message auth0-global-message-error">{error.message || 'There was an error!'}</div>}
            <div className="auth0-lock-view-content">
              <div className="auth0-lock-body-content">
                <div className="auth0-lock-content">
                  <div className="auth0-lock-form">
                    {user.picture && <img src={user.picture} style={{display:'block', margin:'0 auto 10px auto', width:60, height: 60, borderRadius: '100%'}} />}

                    <p>
                      <span style={{fontWeight:'bold', display:'block'}}>Hello, it looks like you are new here!</span>
                      <span>Confirm your name and email are correct and choose a username...</span>
                    </p>

                    <div className="auth0-lock-input-block">
                      <div className="auth0-lock-input-wrap auth0-lock-input-wrap-with-icon">
                        <span><i style={{position:'absolute'}}>i</i></span>
                        <input type="text" name="name" className="auth0-lock-input" placeholder="Your Name" value={user.name} onChange={onChange} />
                      </div>
                    </div>

                    <div className="auth0-lock-input-block">
                      <div className="auth0-lock-input-wrap auth0-lock-input-wrap-with-icon">
                        <span><i style={{position:'absolute'}}>i</i></span>
                        <input type="email" name="email" className="auth0-lock-input" placeholder="yours@example.com" autoCapitalize="off" value={user.email} onChange={onChange} />
                      </div>
                    </div>

                    <div className="auth0-lock-input-block">
                      <div className="auth0-lock-input-wrap auth0-lock-input-wrap-with-icon">
                        <span><i style={{position:'absolute'}}>i</i></span>
                        <input type="text" name="username" className="auth0-lock-input" placeholder="username" value={user.username} onChange={onChange} />
                      </div>
                    </div>
                    
                    <p className="auth0-lock-alternative">
                      <Link href={{query:{action:'verify'}}}><a className="auth0-lock-alternative-link">Already have a profile?</a></Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button className="auth0-lock-submit" type="submit" style={{backgroundColor: options.theme.primaryColor}}>
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

export default Form;