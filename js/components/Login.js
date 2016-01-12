import React, {Component, PropTypes} from 'react';

import auth from '../utils/auth';

import CSSModules from 'react-css-modules';

import styles from './Login.scss';

class Login extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    error: false
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const email = this.refs.email.value;

    auth.login(email, (loggedIn) => {
      if (!loggedIn) {
        return this.setState({error: true});
      }

      const { location } = this.props;

      if (location.state && location.state.nextPathname) {
        this.context.router.replace(location.state.nextPathname);
      } else {
        this.context.router.replace('/');
      }
    });
  };

  render() {
    return (

      <div className="container-fluid">

        <div className="header clearfix">
          <h3 className="text-muted">Project name</h3>
        </div>

        <div styleName='main'>

          <div styleName='login-form'>

            <h1>Member Login</h1>

            {/* <div styleName='head'>
             <img src='images/user.png' alt=''/>
             </div>*/}

            <form onSubmit={this.handleSubmit}>
              <input ref='email' type='text' className='text' placeholder='USERNAME' defaultValue='amadou.cisse' autoFocus/>
              <input className='hidden' type='password' placeholder='Password'/>
              <div className='submit'>
                <input type='submit' value='LOGIN'/>
              </div>
              <p className='hidden'><a href='#'>Forgot Password ?</a></p>
            </form>

          </div>

        </div>


        <footer className="footer">
          <p>&copy; 2015 Company, Inc.</p>
        </footer>

      </div>
    );
  }
}

export default CSSModules(Login, styles, {});
