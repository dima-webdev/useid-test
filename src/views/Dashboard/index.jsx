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

const projects = [
  { id: 'p1', title: 'Adidas' },
  { id: 'p5', title: 'The secret project' },
  { id: 'p2', title: 'Hermitage' },
  { id: 'p4', title: 'Lidl' },
  { id: 'p3', title: 'Dog rates' },
]

class Dashboard extends Component {
  render() {
    const { classes, className, ...rest } = this.props;

    let projectsList = projects.map(element =>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={element.id + '-content'}
          id={element.id + '-header'}
        >
          <Typography className={classes.heading}>{element.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Task 1<br/>
            Universe search<br/>
            SPb-Hel transfers<br/>
            Allegro travellers
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );

    return (
      <DashboardLayout title="Dashboard">
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
              <Portlet
                {...rest}
              >
                <PortletHeader>
                  <PortletLabel
                    title="Last projects"
                  />
                </PortletHeader>
                {
                  projectsList
                }
              </Portlet>
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={4}
              xs={12}
            >
            <Portlet
              {...rest}
            >
              <PortletHeader>
                <PortletLabel
                  title="Dev news"
                  subtitle="version 0.0.1"
                />
              </PortletHeader>
              <PortletContent>
                <Typography>
                  В этой версии вы можете Искать группы Вконтакте используя ключевыя слова
                  и фильтрацию по словам-исключениям, городам и количеству участников в группе
                </Typography>
              </PortletContent>
            </Portlet>
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
