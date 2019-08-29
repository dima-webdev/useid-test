import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid } from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';
import { Redirect } from 'react-router-dom';
import {injectIntl} from 'react-intl';

import {TaskContext} from '../../services/taskContext';
import { resolveClient } from '../../services/apiContext/index.jsx'

import { GroupSearchForm, SearchResult } from './components'
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  item: {
    height: '100%'
  }
});

class GroupSearch extends Component {
  state = {
    tasks: [],
    tasksById: {},
    statesById: {},
    task: '',
  };

  componentDidMount() {
    resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_getTaskInfo();
      })
      .then((response) => {
        const tasks = response.obj;
        this.setState({tasks});

        let tasksById = {};
        let statesById = {};

        tasks.forEach((task) => {
          tasksById[task.id] = task;
          statesById[task.id] = task.state;
        })

        this.setState({tasksById});
        this.setState({statesById});
      })
  }

  render() {
    const { classes, match, intl } = this.props;
    const taskId = match.params.taskId || null;

    return (
      <TaskContext.Consumer>{
        tasks => {

          return (
      <DashboardLayout title={intl.messages['vk-group-search.title']}>
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
            {
              taskId
              ? <SearchResult taskId={taskId} />
              : <GroupSearchForm
              onSearchStart={(task) => {
                console.log(task);
                // task.name = task.taskname || 'New Task';
                // task.id = task.id || Math.floor(Math.random() * 10000).toString()
                //
                // // tasks.createTask(task)
                // .then(() => this.setState({
                //   redirectTo: `/group-search/${task.id}`
                // }));
              }} />
            }
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

export default injectIntl(withStyles(styles)(GroupSearch));
