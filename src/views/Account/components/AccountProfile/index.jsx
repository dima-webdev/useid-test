import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Avatar, Typography, Button, LinearProgress } from '@material-ui/core';
import { Portlet, PortletContent, PortletFooter } from 'components';
import styles from './styles';
import { ApiContext, resolveClient } from '../../../../services/apiContext/index.jsx'

class AccountProfile extends Component {

  state = {
    login: '',
  };

  componentDidMount() {
    resolveClient()
      .then((client) => {
        return client.apis.default.getCurrentUser_1();
      })
      .then((response) => {
        this.setState({login: response.obj.email})
      })

    resolveClient()
      .then((client) => {
        return client.apis.default.getTaskStatuses_1(['471a09f8-566f-471f-a55a-9f0dc0b0438f']);
      })
      .then((response) => {
        console.log('task', response);
      })
  }

  render() {
    const { classes, className, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletContent>
          <div className={classes.details}>
            <div className={classes.info}>
              <Typography variant="h2">{this.state.login}</Typography>
              <Typography
                className={classes.locationText}
                variant="body1"
              >
                Russia
              </Typography>
              <Typography
                className={classes.dateText}
                variant="body1"
              >

              </Typography>
            </div>
            <Avatar
              className={classes.avatar}
              src="/images/avatar.png"
            />
          </div>
        </PortletContent>
        <PortletFooter>
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
          >
            Upload picture
          </Button>
          <Button variant="text">Remove picture</Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

AccountProfile.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountProfile);
