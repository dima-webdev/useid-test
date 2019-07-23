import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Link } from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CreationForm } from './components';

import {TaskContext} from '../../services/taskContext';
import { ApiContext, resolveClient } from '../../services/apiContext/index.jsx';

const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});


const projects = [
  { id: 'p1', title: 'Adidas' },
]

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

    let projectsList = this.state.projects.map(element =>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={element.id + '-content'}
          id={element.id + '-header'}
        >
          <Typography className={classes.heading}>{element.title}</Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    );

    return (
      <DashboardLayout title="Projects">
        <div className={classes.root}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            lg={4}
            md={6}
            xl={4}
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
          {
            projectsList
          }
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
