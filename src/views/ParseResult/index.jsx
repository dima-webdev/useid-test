import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Dashboard as DashboardLayout } from 'layouts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { resolveClient } from '../../services/apiContext/index.jsx';
import { TaskContext } from '../../services/taskContext/index.jsx';
import {injectIntl} from 'react-intl';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link,
  CircularProgress,
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
    searchFilter: '',
    statusFilter: '',
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
    } else {
      console.log('else');
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
    const { classes, className, match, intl, ...rest } = this.props;
    const taskId = match.params.taskId || null;

    const rootClassName = classNames(classes.root, className);
    const tableClassName = classNames(classes.table, className);

    const header = 'data:text/csv;charset=utf-8;base64,'

    const text = header + btoa(this.state.parsedData);

    return (
      <DashboardLayout title={intl.messages['parse-result.title']}>
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
                title={intl.messages['parse-result.task-info']}
              />
            </PortletHeader>
            <PortletContent>
              <div className={classes.field}>

                <Typography>{intl.messages['parse-result.task-info-title']} {this.state.taskInfo.title} <br/><br/></Typography>
                <Typography>{intl.messages['parse-result.task-info-state']} {this.state.taskInfo.state} <br/><br/></Typography>

                {this.state.taskState === 'RUNNING' ?
                  <CircularProgress className={classes.progress} /> :
                  <></>
                }

                <Button
                  download={this.state.taskInfo.title + ".txt"}
                  color="primary"
                  variant="contained"
                  href={text}
                  disabled={this.state.taskState !== 'COMPLETED'}
                >
                  {intl.messages['button.export']}
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
                title={intl.messages['parse-result.table-title']}
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
                  {intl.messages['parse-result.select-project']}
                </MenuItem>
                {tasks.projects.map( task => (
                  <MenuItem key={task.id} value={task.id}>{task.title}</MenuItem>
                ))}
                </Select>
                <FormHelperText>{intl.messages['parse-result.filter-project']}</FormHelperText>
              </FormControl>
            }}
            </TaskContext.Consumer>

            <FormControl className={classes.formControl}>
              <Select
                value={this.state.searchFilter}
                onChange={(event) => { this.setState({searchFilter: event.target.value}) }}
                name="search"
                displayEmpty
                className={classes.selectEmpty}
              >
                <MenuItem value="" key="">
                  {intl.messages['parse-result.select-search-type']}
                </MenuItem>
                <MenuItem key='groups-search' value='VK_SEARCH'>Groups</MenuItem>
                <MenuItem key='audience-search' value='VK_PARSE'>Audience</MenuItem>
              </Select>
              <FormHelperText>{intl.messages['parse-result.filter-search-type']}</FormHelperText>
            </FormControl>

            <FormControl className={classes.formControl}>
              <Select
                value={this.state.statusFilter}
                onChange={(event) => { this.setState({statusFilter: event.target.value}) }}
                name="status"
                displayEmpty
                className={classes.selectEmpty}
              >
                <MenuItem value="" key="">
                  {intl.messages['parse-result.select-state']}
                </MenuItem>
                <MenuItem key='status-completed' value='COMPLETED'>Completed</MenuItem>
                <MenuItem key='status-running' value='RUNNING'>Running</MenuItem>
                <MenuItem key='status-aborted' value='ABORTED'>Aborted</MenuItem>
              </Select>
              <FormHelperText>{intl.messages['parse-result.filter-state']}</FormHelperText>
            </FormControl>

            <div className={tableClassName}>

              <Table>
                <TableHead>
                  <TableRow>

                    <TableCell align="left">{intl.messages['parse-result.table-head-date']}</TableCell>
                    <TableCell align="left">{intl.messages['parse-result.table-head-project']}</TableCell>
                    <TableCell align="left">{intl.messages['parse-result.table-head-name']}</TableCell>
                    <TableCell align="left">{intl.messages['parse-result.table-head-search-type']}</TableCell>
                    <TableCell align="left">{intl.messages['parse-result.table-head-state']}</TableCell>
                    <TableCell align="left">{intl.messages['parse-result.table-head-actions']}</TableCell>

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
                      .filter((task) => {
                        if (this.state.searchFilter) {
                          return task.type === this.state.searchFilter;
                        }
                        return true;
                      })
                      .filter((task) => {
                        if (this.state.statusFilter) {
                          return task.state === this.state.statusFilter;
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
                                {intl.messages['button.export']}
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
                               {intl.messages['button.cancel']}
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

export default injectIntl(withStyles(styles)(ParseResult));
