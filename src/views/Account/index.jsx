import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';
import { AccountDetails } from './components';
import {injectIntl} from 'react-intl';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});

class Account extends Component {
  state = { tabIndex: 0 };

  render() {
    const { classes, intl } = this.props;

    return (
      <DashboardLayout title={intl.messages['account.title']}>
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              lg={8}
              md={6}
              xl={8}
              xs={12}
            >
              <AccountDetails />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectIntl(withStyles(styles)(Account));
