import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Dashboard as DashboardLayout } from 'layouts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { ApiContext, resolveClient } from '../../services/apiContext/index.jsx';
import { TaskContext } from '../../services/taskContext/index.jsx';
// import { Link, NavLink } from 'react-router-dom';

import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter,
} from 'components';

import {
  Block as CancelIcon,
  PauseCircleOutline as PauseIcon,
  PlayCircleOutline as RestartIcon,
} from '@material-ui/icons';

import styles from './styles';

class ParseResult extends Component {
  state = {
    taskId: '',
    allTasks: {},
    allSearchTasks: {},
    allTasksArr: [],
    allSearchTasksArr: [],
    taskInfo: {},
    taskState: '',
    parsedData: '',
    projects: [],
    projectsById: {},
    selectedProject: '',
    projectFilter: '',
   };

   componentDidMount() {
     this.fetchData();

     resolveClient()
       .then((client) => {
         return client.apis.default.ProjectEndpoint_getCurrentUserProjects();
       })
       .then((response) => {
         let projectsById = {};
         response.obj.forEach((task) => projectsById[task.id] = task);
         this.setState({
           projects: response.obj,
           projectsById,
         })

         console.log('projectsById', this.state.projectsById);
       })


   }

   componentDidUpdate(prevProps) {
     if (this.props.match.params.taskId !== prevProps.match.params.taskId) {
       this.fetchData();
     }
   }

  fetchData() {

    let taskId = this.props.match.params.taskId;

    if (taskId) {
      this.setState({taskId});
      this.checkParseState(taskId);

      // resolveClient()
      //   .then((client) => {
      //     return Promise.all([
      //       client.apis.default.VkParseTaskEndpoint_getResult({taskId}),
      //       client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [taskId]}),
      //       // почему приходит пустой массив?
      //       client.apis.default.VkParseTaskEndpoint_getTaskInfo({ids: [taskId]}),
      //       client.apis.default.VkParseTaskEndpoint_getTaskInfo(),
      //       client.apis.default.VkSearchTaskEndpoint_getTaskInfo(),
      //     ])
      //   })
      //   .then((result) => {
      //     console.log('getResult1 result', result);
      //     let tasksObj = {};
      //     result[3].body.forEach((task) => tasksObj[task.id] = task);
      //
      //     let searchTasksObj = {};
      //     result[4].body.forEach((task) => searchTasksObj[task.id] = task);
      //
      //     let sortedTasks = result[3].body.sort((a,b) => b.createdAt - a.createdAt);
      //     let sortedSearchTasks = result[4].body.sort((a,b) => b.createdAt - a.createdAt);
      //
      //
      //     this.setState({
      //         allTasks: tasksObj,
      //         allSearchTasks: searchTasksObj,
      //         taskState: result[1].obj[0].state,
      //         allTasksArr: sortedTasks,
      //         allSearchTasksArr: sortedSearchTasks,
      //         taskInfo: result[2].body[0],
      //         parsedData: result[0].body,
      //       })
      //   })

    } else {
      console.log('else');
      // resolveClient()
      //   .then((client) => {
      //     return Promise.all([
      //       client.apis.default.VkParseTaskEndpoint_getTaskInfo(),
      //       client.apis.default.VkSearchTaskEndpoint_getTaskInfo(),
      //     ])
      //   })
      //   .then((result) => {
      //     console.log('getResult result', result);
      //     let tasksObj = {};
      //     result[0].body.forEach((task) => tasksObj[task.id] = task);
      //
      //     let searchTasksObj = {};
      //     result[1].body.forEach((task) => searchTasksObj[task.id] = task);
      //
      //     let sortedTasks = result[0].body.sort((a,b) => b.createdAt - a.createdAt);
      //     let sortedSearchTasks = result[1].body.sort((a,b) => b.createdAt - a.createdAt);
      //
      //     this.setState({
      //         allTasks: tasksObj,
      //         allTasksArr: sortedTasks,
      //         allSearchTasks: searchTasksObj,
      //         allSearchTasksArr: sortedSearchTasks,
      //       })
      //   })
    }


  }

  parseTest() {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_saveTask({
          title: this.state.values.parsingName,
          ids: this.state.selectedGroups,
          entityType: 'GROUPS',
          projectId: this.state.taskProject,
          required: 'SUBSCRIBERS',
        });
      })
      .then((response) => {
        // console.log('save parsing', response)
        this.setState({parseTaskId: response.text});
        setTimeout(() => this.start(response.text), 1000);
      })
  }

  cancelTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_abortTask({id});
      })
      .then((response) => {
        console.log('cancelled', response);
      })
  };

  pauseTask(id) {
    return resolveClient()
      .then((client) => client.apis.default.VkSearchTaskEndpoint_pauseTask({id}));
  }

  checkParseState(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_getTaskInfo({ids: [id]})
      })
      .then((response) => {

        const task = response.obj[0];
        this.setState({
          taskState: task.state,
          taskInfo: task,
        });
        if (task.state === 'COMPLETED') {
          this.getParseResults(id);
        } else {
          setTimeout(() => this.checkParseState(id), 5000);
        }
      })
  }

  getParseState(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [id]})
      })
      .then((response) => {
        // this.setState({parseState})
        console.log('parse state', response);
      })
  }

  getParseResults(id) {
    return resolveClient()
      .then((client) => {
        // return client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [id]})
        return client.apis.default.VkParseTaskEndpoint_getResult({taskId: id})
        // return client.apis.default.VkSearchTaskEndpoint_getResult({taskId: id})
      })
      .then((response) => {
        this.setState({parsedData: response.data})
        console.log('parseResult', response);
      })
  }

  msToDate(ms){
    let d = new Date(ms);
    return d.toTimeString();
    // return d.toTimeString();
  }
  msToLocalDate(ms){
    let d = new Date(ms);
    return d.toLocaleDateString();
    // return d.toTimeString();
  }

  handleFieldChange = (field) => (event) => {
    this.setState({values: {...this.state.values, [field]: event.target.value}});
  };

  render() {
    const { classes, className, match, ...rest } = this.props;
    const taskId = match.params.taskId || null;

    const rootClassName = classNames(classes.root, className);
    const tableClassName = classNames(classes.table, className);

    const groups = this.state.groups;
    const selected = this.state.selectedGroups;

    const header = 'data:text/csv;charset=utf-8;base64,'

    const text = header + btoa(this.state.parsedData);

    // const a = document.querySelector('a')
    // a.href = text;

    return (
      <DashboardLayout title="Раздел в разработке" subtitle="This page is under development">
      <div className={classes.root}>
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

          {this.state.taskId !== '' ?
          <Portlet
            {...rest}
            className={rootClassName}
          >
            <PortletHeader>
              <PortletLabel
                title="Задача с этим id"
              />
            </PortletHeader>
            <PortletContent>
              <div className={classes.field}>

                <Typography>Title: {this.state.taskInfo.title} <br/><br/></Typography>
                <Typography>State: {this.state.taskInfo.state} <br/><br/></Typography>

                {this.state.taskState === 'RUNNING' ?
                  <CircularProgress className={classes.progress} /> :
                  <></>
                }

                <Button
                  // download="hi.txt"
                  download={this.state.taskInfo.title + ".txt"}
                  color="primary"
                  variant="contained"
                  href={text}
                  disabled={this.state.taskState !== 'COMPLETED'}
                >
                  Download
                </Button>
              </div>

            </PortletContent>
          </Portlet>
          : <></>
          }


          <Portlet
            {...rest}
            className={rootClassName}
          >
            <PortletHeader>
              <PortletLabel
                title="All Tasks"
              />
            </PortletHeader>
            <PortletContent>
            <TaskContext.Consumer>
              {tasks => {
                return <FormControl className={classes.formControl}>
                <Select
                  value={this.state.projectFilter}
                  onChange={(event) => { this.setState({projectFilter: event.target.value}) }}
                  name="project"
                  displayEmpty
                  className={classes.selectEmpty}
                >
                <MenuItem value="" key="">
                  Select project
                </MenuItem>
                {tasks.projects.map( task => (
                  <MenuItem key={task.id} value={task.id}>{task.title}</MenuItem>
                ))}
                </Select>
                <FormHelperText>Filter by project</FormHelperText>
              </FormControl>
            }}
            </TaskContext.Consumer>

            <div className={tableClassName}>

              <Table>
                <TableHead>
                  <TableRow>

                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">Project</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Search Type</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Actions</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  <TaskContext.Consumer>
                  { tasks =>
                    {
                      // this.state.allTasksArr
                      return tasks.mixedTasks
                      .sort((a,b) => b.createdAt - a.createdAt)
                      .filter((task) => {
                        if (this.state.projectFilter) {
                          return task.projectId === this.state.projectFilter;
                        }
                        return true;
                      })
                      .map(task => (
                          <TableRow
                          className={classes.tableRow}
                          hover
                          key={task.id}
                        >

                        <TableCell align="left">{this.msToLocalDate(task.createdAt)}</TableCell>
                        <TableCell align="left">{tasks.projectsById[task.projectId].title}</TableCell>
                        <TableCell align="left">
                        <Link
                          component={RouterLink}
                          to={task.type === 'VK_PARSE' ? '/parse-result/' + task.id : '/group-search/' + task.id}
                          key={task.id}
                        >
                          {task.title}
                        </Link>
                        </TableCell>
                        <TableCell align="left">{task.type}</TableCell>
                        <TableCell align="left">{task.state}</TableCell>
                        <TableCell align="left">
                        { task.state === 'COMPLETED' ?
                          <>
                            {
                              task.type === 'VK_PARSE' ?
                              <Link component={RouterLink} to={'/parse-result/' + task.id} key={'-to' + task.id}>
                              <Button
                                onClick={() => window.scrollTo(0, 0)}
                                color="primary"
                                variant="contained"
                              >
                                Download
                              </Button>
                              </Link>
                               : <></>
                            }
                          </>:
                          <>
                            <Button
                              onClick={() => {
                                if (task.type === 'VK_PARSE') {
                                  this.cancelParseTask(task.id)
                                } else {
                                  this.cancelTask(task.id)
                                }
                              }}
                              color="primary"
                              variant="contained"
                            >
                               cancel
                            </Button>

                          </>
                        }
                        </TableCell>
                        </TableRow>

                      ))}
                  }
                  </TaskContext.Consumer>
                </TableBody>
              </Table>
            </div>
            </PortletContent>
            <PortletFooter className={classes.portletFooter}>

            </PortletFooter>
          </Portlet>

          </Grid>
        </Grid>
      </div>
      </DashboardLayout>
    );
  }
}

ParseResult.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  taskId: PropTypes.string,
}

export default withStyles(styles)(ParseResult);
