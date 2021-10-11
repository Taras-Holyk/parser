import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ApiService from './../../services/Api';
import UserStorage from './../../services/UserStorage';
import './Login.scss';
import ValidationErrorsList from './../../components/Error/ValidationErrorsList';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: UserStorage.getAuthStatus(),
      errorMessage: '',
      errors: []
    };
  };

  submit = async (event) => {
    event.preventDefault();

    let errorMessage = '';
    let errors = [];

    const response = await ApiService.post('users/login', {
      email: event.target.email.value,
      password: event.target.password.value
    });

    if (response) {
      if (response.success) {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        UserStorage.setAuthStatus(JSON.stringify(response.data));
      } else if (response.errors && response.errors.length) {
        errors = response.errors;
      } else {
        errorMessage = response.message;
      }

      this.setState({
        isAuthenticated: UserStorage.getAuthStatus(),
        errorMessage,
        errors
      });
    }
  };

  render() {
    if (this.state.isAuthenticated) {
      return <Redirect to='/' />
    }

    return (
      <form onSubmit={this.submit} className="form">
        { this.state.errorMessage.length > 0 && <div>{ this.state.errorMessage }</div> }
        { this.state.errors.length > 0 && <ValidationErrorsList errors={this.state.errors}/> }
        <div>
          <label htmlFor="email" className="form__label">Email</label>
          <input type="email" name="email" id="email" className="form__input"/>
        </div>
        <div>
          <label htmlFor="password" className="form__label">Password</label>
          <input type="password" name="password" id="password" className="form__input"/>
        </div>
        <div className="form__buttons">
          <input type="submit" value="Login" className="form__submit-button" />
        </div>
      </form>
    );
  };
}

export default Login;
