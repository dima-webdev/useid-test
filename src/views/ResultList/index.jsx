import React, { Component } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import classNames from 'classnames';
import {
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography
} from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  item: {
    height: '100%'
  }
});


class ResultList extends Component {
  render() {
    const { classes, className, ...rest } = this.props;


    return (
      <DashboardLayout title="Dashboard">
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
results
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

ResultList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultList);
