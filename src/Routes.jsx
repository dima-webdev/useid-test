import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Views
import Dashboard from './views/Dashboard';
// import Account from './views/Account';
// import Settings from './views/Settings';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import GroupSearch from './views/GroupSearch'
// import NotFound from './views/NotFound';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect
          exact
          from="/"
          to="/dashboard"
        />
        <Route
          component={Dashboard}
          exact
          path="/dashboard"
        />
        <Route
          component={SignUp}
          exact
          path="/sign-up"
        />
        <Route
          component={SignIn}
          exact
          path="/sign-in"
        />
        <Route
          component={GroupSearch}
          exact
          path="/group-search"
        />
      </Switch>
    );
  }
}
