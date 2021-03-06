import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CreationForm } from './components';

import { resolveClient } from '../../services/apiContext/index.jsx';
import { ProjectContext } from '../../services/projectContext/index.jsx';

const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class Projects extends Component {
  state = {
    userId: '',
    projects:[]
  };

  // projects = [];

  componentDidMount() {
    resolveClient()
      .then((client) => {
        return client.apis.default.UserEndpoint_getCurrentUser();
      })
      .then((response) => {
        this.setState({userId: response.obj.id})
      })
      .then(() => {
        return resolveClient()
          .then((client) => {
            console.log(this.state.userId);
            // return client.apis.default.ProjectEndpoint_getUserProjects({userId: this.state.userId});
            return client.apis.default.ProjectEndpoint_getCurrentUserProjects();
          })
          .then((response) => {

            this.setState({projects: response.obj})
            console.log('projects', response.obj);
          })
      })
  }


  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Projects">
        <div className={classes.root}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            lg={8}
            md={8}
            xl={6}
            xs={12}
          >
            <CreationForm />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xl={8}
            xs={12}
          >
          <ProjectContext.Consumer>
            { ({projectsArr, setCurrentProject}) =>
              { if (projectsArr) {
                return projectsArr
                .map(element =>
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
                }
              }
            }
          </ProjectContext.Consumer>

          </Grid>
        </Grid>
        </div>
      </DashboardLayout>
    );
}
}

Projects.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Projects);
