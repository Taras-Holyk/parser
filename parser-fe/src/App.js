import React, { Component } from 'react';
import './App.scss';
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import {Route, Switch} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ProtectedRoute from './helpers/ProtectedRoute';
import UserStorage from './services/UserStorage';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: UserStorage.getAuthStatus()
    }
  }

  setIsAuth = (props) => {
    this.setState({
      isAuthenticated: props.isAuthenticated
    })
  };

  render() {
    return (
      <div>
        <Header setIsAuth={this.setIsAuth}/>
        <Switch>
          <ProtectedRoute exact
            path='/'
            component={Dashboard}
          />
          <Route
            path='/login'
            component={Login}
          />
          <Route
            path='/register'
            component={Register}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
