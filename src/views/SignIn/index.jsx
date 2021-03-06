import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { resolveClient } from '../../services/apiContext/index.jsx';
import sha256 from 'js-sha256';
import {injectIntl} from 'react-intl';

// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Grid,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Typography
} from '@material-ui/core';

// Material icons
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared components
import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons';

// Component styles
import styles from './styles';

// Form validation schema
import schema from './schema';

// Service methods
const signIn = (email, password) => {

  return resolveClient()
    .then((client) => {
      return client.apis.default.LoginEndpoint_login({login: email, password: sha256(password)});
    })
    .then((response) => {
      if (response.ok) {
        localStorage.setItem('auth_token', response.text);
        let ev = new Event('refresh-client')
        window.dispatchEvent(ev);
      };
      console.log(response);
      return response;
    })
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 1500);
  // });
};

class SignIn extends Component {
  state = {
    values: {
      email: '',
      password: ''
    },
    touched: {
      email: false,
      password: false
    },
    errors: {
      email: null,
      password: null
    },
    isValid: false,
    isLoading: false,
    submitError: null
  };

  handleBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
  }, 300);

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };

  handleSignIn = async () => {
    try {
      const { history } = this.props;
      const { values } = this.state;

      this.setState({ isLoading: true });

      await signIn(values.email, values.password);

      localStorage.setItem('isAuthenticated', true);

      history.push('/dashboard');
    } catch (error) {
      this.setState({
        isLoading: false,
        serviceError: error
      });
    }
  };

  render() {
    const { classes, intl } = this.props;
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      isLoading
    } = this.state;

    const showEmailError = touched.email && errors.email;
    const showPasswordError = touched.password && errors.password;

    return (
      <div className={classes.root}>
        <Grid
          className={classes.grid}
          container
        >
          <Grid
            className={classes.quoteWrapper}
            item
            lg={5}
          >
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography
                  className={classes.quoteText}
                  variant="h1"
                >
                  Test text
                </Typography>
                <div className={classes.person}>
                  <Typography
                    className={classes.name}
                    variant="body1"
                  >
                    Albert Einstein
                  </Typography>
                  <Typography
                    className={classes.bio}
                    variant="body2"
                  >

                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid
            className={classes.content}
            item
            lg={7}
            xs={12}
          >
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton
                  className={classes.backButton}
                  onClick={this.handleBack}
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    {intl.messages['auth.sign-in']}
                  </Typography>
                  <Typography
                    className={classes.subtitle}
                    variant="body1"
                  >
                    {intl.messages['auth.sign-in-social']}
                  </Typography>
                  <Button
                    className={classes.facebookButton}
                    color="primary"
                    onClick={this.handleSignIn}
                    size="large"
                    variant="contained"
                    disabled
                  >
                    <FacebookIcon className={classes.facebookIcon} />
                    {intl.messages['auth.login-fb']}
                  </Button>
                  <Button
                    className={classes.googleButton}
                    onClick={this.handleSignIn}
                    size="large"
                    variant="contained"
                    disabled
                  >
                    <GoogleIcon className={classes.googleIcon} />
                    {intl.messages['auth.login-vk']}
                  </Button>
                  <Typography
                    className={classes.sugestion}
                    variant="body1"
                  >
                    {intl.messages['auth.login-email']}
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label={intl.messages['auth.input-email']}
                      name="email"
                      onChange={event =>
                        this.handleFieldChange('email', event.target.value)
                      }
                      type="text"
                      value={values.email}
                      variant="outlined"
                    />
                    {showEmailError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.email[0]}
                      </Typography>
                    )}
                    <TextField
                      className={classes.textField}
                      label={intl.messages['auth.input-password']}
                      name="password"
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                    {showPasswordError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.password[0]}
                      </Typography>
                    )}
                  </div>
                  {submitError && (
                    <Typography
                      className={classes.submitError}
                      variant="body2"
                    >
                      {submitError}
                    </Typography>
                  )}
                  {isLoading ? (
                    <CircularProgress className={classes.progress} />
                  ) : (
                    <Button
                      className={classes.signInButton}
                      color="primary"
                      disabled={!isValid}
                      onClick={this.handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      {intl.messages['button.sign-in-now']}
                    </Button>
                  )}
                  <Typography
                    className={classes.signUp}
                    variant="body1"
                  >
                    {intl.messages['auth.no-account']}{' '}
                    <Link
                      className={classes.signUpUrl}
                      to="/sign-up"
                    >
                      {intl.messages['button.sign-up']}
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SignIn.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default injectIntl(
  compose(
    withRouter,
    withStyles(styles)
  )(SignIn)
);
