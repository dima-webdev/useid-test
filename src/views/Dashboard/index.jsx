import React, { Component } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {injectIntl} from 'react-intl'
import classNames from 'classnames';
import { ProjectContext } from '../../services/projectContext/index.jsx';

import {
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
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

const projects = [];

class Dashboard extends Component {
  render() {
    const { classes, className, intl, ...rest } = this.props;

    console.log("messages", intl);

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
      <DashboardLayout title={intl.messages['test.title']}>
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
                <ProjectContext.Consumer>
                  { ({currentProject, allProjects, projectsArr}) => {
                    // this.allProjects = allProjects;
                    console.log({projectsArr});
                    if (projectsArr) {
                      return (
                        projectsArr.map(element =>
                          <ExpansionPanel>
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={element.id + '-content'}
                              id={element.id + '-header'}
                            >
                              <Typography className={classes.heading}>{element.title}</Typography>
                            </ExpansionPanelSummary>
                          </ExpansionPanel>
                        )
                      )
                    }
                  }}
                </ProjectContext.Consumer>
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

export default injectIntl(withStyles(styles)(Dashboard));
