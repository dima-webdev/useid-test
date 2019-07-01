import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';
import { Redirect } from 'react-router-dom';

import {TaskContext} from '../../services/taskContext';

import { GroupSearchForm, GroupSearchResult } from './components'
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  item: {
    height: '100%'
  }
});

class GroupSearch extends Component {
  state = {};

  render() {
    const { classes, match } = this.props;
    const taskId = match.params.taskId || null;

    console.log(taskId);
    return (
      <TaskContext.Consumer>{
        tasks => {

          return (
      <DashboardLayout title="Group Search">
        <div className={classes.root}>
        {this.state.redirectTo
          ? <Redirect
            push
            to={{
              pathname: this.state.redirectTo
            }}
          />
          : null }
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
            { taskId
              ? <GroupSearchResult taskId={taskId} />
              : <GroupSearchForm onSearchStart={(task) => {
                console.log(task);
                task.name = task.taskname || 'Taskname';
                task.id = task.id || Math.floor(Math.random() * 10000).toString()

                tasks.createTask(task)
                .then(() => this.setState({
                  redirectTo: `/group-search/${task.id}`
                }));
              }} />}
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }}</TaskContext.Consumer>);
}
}

GroupSearch.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GroupSearch);
