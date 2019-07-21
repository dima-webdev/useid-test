import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Views
import Dashboard from './views/Dashboard';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Account from './views/Account';
import Settings from './views/Settings';
import GroupSearch from './views/GroupSearch'
import NotFound from './views/NotFound';
import Projects from './views/Projects';
import ResultList from './views/ResultList';
import Drafts from './views/Drafts';

class ProtectedRoute extends Component {
  render() {
    let isAuth = localStorage.getItem('isAuthenticated');
    return isAuth ? <>{this.props.children}</> : <Redirect to="/sign-in" />
  }
}

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect
          exact
          from="/"
          to="/group-search"
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
        <Route
          component={Drafts}
          exact
          path="/drafts"
        />
        <Route
          component={GroupSearch}
          path="/group-search/:taskId"
        />
        <Route
          component={Account}
          exact
          path="/account"
        />
        <Route
          component={Settings}
          exact
          path="/settings"
        />
        <ProtectedRoute>
          <Route
            component={Projects}
            exact
            path="/projects"
          />
        </ProtectedRoute>
        <Route
          component={ResultList}
          exact
          path="/results"
        />
        <Route
          component={NotFound}
          exact
          path="/not-found"
        />
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}
