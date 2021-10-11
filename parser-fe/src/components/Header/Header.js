import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserStorage from './../../services/UserStorage';
import './Header.scss';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: UserStorage.getAuthStatus()
    };
  };

  logout = async () => {
    UserStorage.logout();

    this.setState({
      isAuthenticated: UserStorage.getAuthStatus()
    });

    this.props.setIsAuth(this.state);
  };

  render() {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    return (
      <div className="header">
        {
          !UserStorage.getAuthStatus()
          ? <React.Fragment>
              <Link to='/register'>Register</Link>
              <Link to='/login'>Login</Link>
            </React.Fragment>
          : <React.Fragment>
              <span className="header__user">{authUser.name}</span>
              <a href='javascript:;' onClick={this.logout}>Logout</a>
            </React.Fragment>
        }
      </div>
    );
  };
}

export default Header;
