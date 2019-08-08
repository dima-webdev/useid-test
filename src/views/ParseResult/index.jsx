import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Dashboard as DashboardLayout } from 'layouts';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { ApiContext, resolveClient } from '../../services/apiContext/index.jsx'
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
   };

   componentDidMount() {
     this.fetchData();
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

      resolveClient()
        .then((client) => {
          return Promise.all([
            client.apis.default.VkParseTaskEndpoint_getResult({taskId}),
            client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [taskId]}),
            // почему приходит пустой массив?
            client.apis.default.VkParseTaskEndpoint_getTaskInfo({ids: [taskId]}),
            client.apis.default.VkParseTaskEndpoint_getTaskInfo(),
            client.apis.default.VkSearchTaskEndpoint_getTaskInfo(),
          ])
        })
        .then((result) => {
          console.log('getResult1 result', result);
          let tasksObj = {};
          result[3].body.forEach((task) => tasksObj[task.id] = task);

          let searchTasksObj = {};
          result[4].body.forEach((task) => searchTasksObj[task.id] = task);

          let sortedTasks = result[3].body.sort((a,b) => b.createdAt - a.createdAt);
          let sortedSearchTasks = result[4].body.sort((a,b) => b.createdAt - a.createdAt);


          this.setState({
              allTasks: tasksObj,
              allSearchTasks: searchTasksObj,
              taskState: result[1].obj[0].state,
              allTasksArr: sortedTasks,
              allSearchTasksArr: sortedSearchTasks,
              taskInfo: result[2].body[0],
              parsedData: result[0].body,
            })
        })
    } else {
      resolveClient()
        .then((client) => {
          return Promise.all([
            client.apis.default.VkParseTaskEndpoint_getTaskInfo(),
            client.apis.default.VkSearchTaskEndpoint_getTaskInfo(),
          ])
        })
        .then((result) => {
          console.log('getResult result', result);
          let tasksObj = {};
          result[0].body.forEach((task) => tasksObj[task.id] = task);

          let searchTasksObj = {};
          result[1].body.forEach((task) => searchTasksObj[task.id] = task);

          let sortedTasks = result[0].body.sort((a,b) => b.createdAt - a.createdAt);
          let sortedSearchTasks = result[1].body.sort((a,b) => b.createdAt - a.createdAt);

          this.setState({
              allTasks: tasksObj,
              allTasksArr: sortedTasks,
              allSearchTasks: searchTasksObj,
              allSearchTasksArr: sortedSearchTasks,
            })
        })
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

  checkParseState() {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [this.state.parseTaskId]})
      })
      .then((response) => {
        if (response.obj[0].state === 'COMPLETED') {
          this.setState({parseState: 'completed'});
          this.getParseResults(this.state.parseTaskId);
        } else {
          setTimeout(() => this.checkParseState(), 5000);
        }
      })
  }

  getParseState(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [this.state.parseTaskId]})
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
        return client.apis.default.VkParseTaskEndpoint_getResult({taskId: this.state.parseTaskId})
        // return client.apis.default.VkSearchTaskEndpoint_getResult({taskId: id})
      })
      .then((response) => {
        this.setState({parsedData: response.data})
        console.log('parseResult', response);
      })
  }

  msToDate(ms){
    // let d = new Date(parseInt(ms));
    let d = new Date(ms);
    return d.toTimeString();
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
              download="data.txt"
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
            title="Задачи на сбор аудитории"
          />
        </PortletHeader>
        <PortletContent>
        <div className={tableClassName}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Actions</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.allTasksArr
                .map(task => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={task.id}
                  >
                  <TableCell className={classes.tableCell, classes.descCell}>{this.msToDate(task.createdAt)}</TableCell>
                  <TableCell className={classes.tableCell, classes.descCell}>{task.id}</TableCell>
                  <TableCell className={classes.tableCell, classes.descCell}>
                    <Link component={RouterLink} to={'/parse-result/' + task.id} key={task.id}>
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell className={classes.tableCell, classes.descCell}>{task.state}</TableCell>
                  <TableCell className={classes.tableCell, classes.descCell}>
                  { task.state === 'COMPLETED' ?
                    <Link component={RouterLink} to={'/parse-result/' + task.id} key={task.id}>
                      Download
                    </Link> :
                    <>
                      <IconButton
                        className={classes.icon}
                        onClick={() => {
                          this.cancelTask(task.id);
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                      <IconButton
                        className={classes.icon}
                        onClick={() => {
                          this.pauseTask(task.id);
                        }}
                      >
                        <PauseIcon />
                      </IconButton>
                    </>
                  }
                  </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>

        </PortletFooter>
      </Portlet>
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            title="Задачи на поиск групп"
          />
        </PortletHeader>
        <PortletContent>
        <div className={tableClassName}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Actions</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.allSearchTasksArr
                .map(task => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={task.id}
                  >
                  <TableCell className={classes.tableCell, classes.descCell}>{this.msToDate(task.createdAt)}</TableCell>
                  <TableCell className={classes.tableCell, classes.descCell}>{task.id}</TableCell>
                  <TableCell className={classes.tableCell, classes.descCell}>
                    <Link component={RouterLink} to={'/group-search/' + task.id} key={task.id}>
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell className={classes.tableCell, classes.descCell}>{task.state}</TableCell>
                  <TableCell className={classes.tableCell, classes.descCell}>
                  { task.state === 'COMPLETED' ?
                    <>
                    </> :
                    <>
                      <IconButton
                        className={classes.icon}
                        onClick={() => {
                          this.cancelTask(task.id);
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                      <IconButton
                        className={classes.icon}
                        onClick={() => {
                          this.pauseTask(task.id);
                        }}
                      >
                        <PauseIcon />
                      </IconButton>
                    </>
                  }
                  </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>

        </PortletFooter>
      </Portlet>
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
