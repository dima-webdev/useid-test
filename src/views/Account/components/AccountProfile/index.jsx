import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Avatar, Typography, Button, LinearProgress } from '@material-ui/core';
import { Portlet, PortletContent, PortletFooter } from 'components';
import styles from './styles';

class AccountProfile extends Component {
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
              <Typography variant="h2">Test User</Typography>
              <Typography
                className={classes.locationText}
                variant="body1"
              >
                Ukraine
              </Typography>
              <Typography
                className={classes.dateText}
                variant="body1"
              >
                4:32PM (GMT-4)
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
