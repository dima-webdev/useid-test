import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField, Typography } from '@material-ui/core';
import {injectIntl} from 'react-intl';

import { resolveClient } from '../../../../services/apiContext/index.jsx';

import {
  Portlet,
  PortletHeader,
  PortletContent,
  PortletFooter
} from 'components';

import styles from './styles';

class Account extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    login: '',
  };

  componentDidMount() {
    resolveClient()
      .then((client) => {
        return client.apis.default.UserEndpoint_getCurrentUser();
      })
      .then((response) => {
        this.setState({login: response.obj.email})
      })

  }

  handleChange = e => {
    this.setState({
      state: e.target.value
    });
  };

  handleSignOut = () => {
    const { history } = this.props;

    localStorage.setItem('isAuthenticated', false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentProject');
    history.push('/sign-in');
  };

  render() {
    const { classes, className, intl, ...rest } = this.props;
    const { firstName, lastName, phone, country, email } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <Typography variant="h2">{this.state.login}</Typography>
        </PortletHeader>
        <PortletContent noPadding>
          <form
            autoComplete="off"
            noValidate
          >
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label={intl.messages['account.input-first-name']}
                margin="dense"
                required
                value={firstName}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                label={intl.messages['account.input-last-name']}
                margin="dense"
                required
                value={lastName}
                variant="outlined"
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label={intl.messages['account.input-email']}
                margin="dense"
                required
                value={email}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                label={intl.messages['account.input-phone']}
                margin="dense"
                type="number"
                value={phone}
                variant="outlined"
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label={intl.messages['account.input-country']}
                margin="dense"
                required
                value={country}
                variant="outlined"
              />
            </div>
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="contained"
          >
            {intl.messages['button.save']}
          </Button>
          <Button
            onClick={this.handleSignOut}
            href='/sign-in'>
            {intl.messages['button.log-out']}
          </Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

Account.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default injectIntl(withStyles(styles)(Account));
